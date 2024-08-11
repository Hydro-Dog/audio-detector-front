import { useEffect, useMemo, useRef, useState } from 'react';
import { SCREEN_SIZE } from '@shared/enum/screen-size';
import { useMediaContext, useThemeToken } from '@shared/index';
import { useWindowSize } from 'usehooks-ts';

const filterOutsideRange = (
  range: { min: number; max: number },
  values: Uint8Array,
): Uint8Array => {
  const { min, max } = range;

  // Создаем массив для хранения результатов с длиной равной исходному массиву
  const result = new Uint8Array(values.length);
  let resultIndex = 0;

  // Проходим по каждому значению в массиве и проверяем, попадает ли оно в диапазон
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (value >= min && value <= max) {
      result[resultIndex++] = value;
    }
  }

  // Обрезаем результирующий массив до фактического количества найденных элементов
  return result.slice(0, resultIndex);
};

const removeAlphaChannel = (imageData: ImageData): Uint8Array => {
  const data = imageData.data;
  const length = data.length;
  const rgbData = new Uint8Array((length / 4) * 3); // Новый массив для хранения только RGB-компонентов
  let rgbIndex = 0;

  for (let i = 0; i < length; i += 4) {
    // Копируем только RGB-компоненты
    rgbData[rgbIndex++] = data[i]; // Red
    rgbData[rgbIndex++] = data[i + 1]; // Green
    rgbData[rgbIndex++] = data[i + 2]; // Blue
    // Пропускаем альфа-канал (data[i + 3])
  }

  return rgbData;
};

type Props = {
  onAlert?: () => void;
  range: { min: number; max: number };
  width: number;
  height: number;
  interval: number;
  motionCoefficient: number;
};

const renderTimeStamp = new Date().valueOf()

export const VideoDetectorWidget = ({
  range = { min: 124, max: 134 },
  width = 640,
  height = 480,
  interval = 10,
  motionCoefficient = 0.1,
  onAlert,
}: Props) => {
  
  const themeToken = useThemeToken();
  const BLENDED_IMG_DATA_LENGTH = useRef(
    removeAlphaChannel(new ImageData(width, height)).length,
  )?.current;

  const ACCEPTABLE_MOTION_PIXEL_COUNT = Math.round(BLENDED_IMG_DATA_LENGTH * motionCoefficient);

  const alpha = 0.5;
  let screenshotIndex = 0;

  const canvas = useRef<HTMLCanvasElement>(null);
  const canvasFinal = useRef<HTMLCanvasElement>(null);
  const videoEl = useRef<HTMLVideoElement>(null);
  const videoElFake = useRef<HTMLVideoElement>(null);

  let imgData: ImageData | null = null;
  const imgDataPrev: ImageData[] | null = [];
  const { media } = useMediaContext();

  const [video, setVideo] = useState<HTMLVideoElement>();
  const [greyPixelsCount, setGreyPixelsCount] = useState(1e10);

  // console.log('greyPixelsCount: ', greyPixelsCount)

  const [detected, setDetected] = useState(false);
  const timerRef = useRef(null);

  const cameraAspectRatio = useMemo(
    () => media?.stream?.getVideoTracks?.()?.[0]?.getSettings()?.aspectRatio,
    [media?.stream],
  );

  //TODO: отрефакторить хук
  useEffect(() => {
    const motionPixels = BLENDED_IMG_DATA_LENGTH - greyPixelsCount;

    if (motionPixels > ACCEPTABLE_MOTION_PIXEL_COUNT && Date.now() - renderTimeStamp > 3000) {
      onAlert?.();
      setDetected(true);

      // Очищаем предыдущий таймер, если он есть
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Устанавливаем новый таймер
      //@ts-ignore
      timerRef.current = setTimeout(() => {
        setDetected(false);
        timerRef.current = null;
      }, 1000);
    }
    //@ts-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [greyPixelsCount, imgData?.data.length]);

  useEffect(() => {
    if (videoEl.current) {
      videoEl.current.srcObject = media?.stream;
      //@ts-ignore
      videoElFake.current.srcObject = media?.stream;
      setVideo(videoEl.current);
    }
  }, [media?.stream]);

  useEffect(() => {
    const snapshot = () => {
      if (video && canvas.current && canvasFinal.current) {
        const width = canvas.current.width;
        const height = canvas.current.height;
        const ctx = canvas.current.getContext('2d')!;
        const ctxFinal = canvasFinal.current.getContext('2d');

        ctx.drawImage(video, 0, 0, width, height);
        imgDataPrev![screenshotIndex] = ctx.getImageData(0, 0, width, height);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        screenshotIndex = screenshotIndex === 0 ? 1 : 0;

        // eslint-disable-next-line react-hooks/exhaustive-deps
        imgData = ctx.getImageData(0, 0, width, height);

        const blendedImage = new ImageData(640, 480);

        const length = imgData.data?.length | 0;
        let x = 0;
        if (imgDataPrev![screenshotIndex]?.data) {
          while (x < length) {
            const currentFrameAveragePxVal =
              (imgData.data[x] + imgData.data[x + 1] + imgData.data[x + 2]) / 3;
            const prevFrameAveragePxVal =
              (imgDataPrev![screenshotIndex].data[x] +
                imgDataPrev![screenshotIndex].data[x + 1] +
                imgDataPrev![screenshotIndex].data[x + 2]) /
              3;
            const blended =
              alpha * (255 - currentFrameAveragePxVal) + (1 - alpha) * prevFrameAveragePxVal;

            blendedImage.data[x] = blended;
            blendedImage.data[x + 1] = blended;
            blendedImage.data[x + 2] = blended;
            blendedImage.data[x + 3] = 255;

            x += 4;
          }
          const removedAlphaImage = removeAlphaChannel(blendedImage);
          setGreyPixelsCount(filterOutsideRange(range, removedAlphaImage).length);
          (ctxFinal as CanvasRenderingContext2D).putImageData(blendedImage, 0, 0);
        }
      }
    };

    const id = setInterval(snapshot, interval);

    return () => clearInterval(id);
  }, [video, range, interval]);

  const { width: viewportWidth } = useWindowSize();

  const videoWidth = useMemo(() => {
    if (viewportWidth > SCREEN_SIZE.MD) {
      return window.innerHeight * 0.8;
    } else if (viewportWidth < SCREEN_SIZE.MD && viewportWidth > SCREEN_SIZE.SM) {
      return 600;
    } else {
      return 250;
    }
  }, [viewportWidth]);

  return (
    <div>
      <video
        ref={videoElFake}
        width={videoWidth}
        autoPlay
        muted
        className="rounded-md"
        style={{
          aspectRatio: cameraAspectRatio,
          background: detected! ? themeToken.colorErrorBg : themeToken['blue-1'],
          boxShadow: `var(--tw-ring-inset) 0 0 0 ${detected! ? '4px' : '1px'} ${detected! ? themeToken.colorError : themeToken.colorPrimary}`,
        }}></video>

      <video
        ref={videoEl}
        width={640}
        height={480}
        autoPlay
        muted
        className="rounded-md absolute top-0"
        style={{
          opacity: 0,
          aspectRatio: cameraAspectRatio,
          background: detected! ? themeToken.colorErrorBg : themeToken['blue-1'],
          boxShadow: `var(--tw-ring-inset) 0 0 0 ${detected! ? '4px' : '1px'} ${detected! ? themeToken.colorError : themeToken.colorPrimary}`,
        }}></video>
      <canvas
        style={{
          opacity: 0,
        }}
        className="absolute top-0"
        ref={canvas}
        width={640}
        height={480}></canvas>
      <canvas
        ref={canvasFinal}
        width={640}
        height={480}
        className="rounded-md absolute top-0"
        style={{
          opacity: 0,
          background: detected! ? themeToken.colorErrorBg : themeToken['blue-1'],
          boxShadow: `var(--tw-ring-inset) 0 0 0 ${detected! ? '4px' : '1px'} ${detected! ? themeToken.colorError : themeToken.colorPrimary}`,
        }}></canvas>
    </div>
  );
};
