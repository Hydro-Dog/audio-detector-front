/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  VideoSettingsType,
  useAudioSettingsContext,
  useMediaContext,
  useThemeToken,
} from '@shared/index';
import classnames from 'classnames';
import { useWindowSize } from 'usehooks-ts';
import { SignalFilled } from '@ant-design/icons';
import { SCREEN_SIZE } from '@shared/enum/screen-size';

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
};

export const VideoDetectorWidget = ({
  range = { min: 124, max: 134 },
  width = 640,
  height = 480,
  interval = 30,
  motionCoefficient = 0.1,
  onAlert,
}: VideoSettingsType & Props) => {
  const token = useThemeToken();
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
  const [greyPixelsCount, setGreyPixelsCount] = useState(0);

  const [detected, setDetected] = useState(false);
  const timerRef = useRef(null);

  const cameraAspectRatio = useMemo(
    () => media?.stream?.getVideoTracks?.()?.[0]?.getSettings()?.aspectRatio,
    [media?.stream],
  );

  //TODO: получить соотношение сторон
  // useEffect(() => {
  //   const aspectRatio = media?.stream?.getVideoTracks?.()?.[0]?.getSettings()?.aspectRatio
  //   console.log('aspectRatio: ', aspectRatio)
  // }, [media?.stream]);

  //TODO: отрефакторить хук
  // useEffect(() => {
  //   const motionPixels = BLENDED_IMG_DATA_LENGTH - greyPixelsCount;
  //   if (motionPixels > ACCEPTABLE_MOTION_PIXEL_COUNT) {
  //     // onAlert();
  //     setDetected(true);

  //     // Очищаем предыдущий таймер, если он есть
  //     if (timerRef.current) {
  //       clearTimeout(timerRef.current);
  //     }

  //     // Устанавливаем новый таймер
  //     timerRef.current = setTimeout(() => {
  //       setDetected(false);
  //       timerRef.current = null;
  //     }, 1000);
  //   }
  // }, [greyPixelsCount, imgData?.data.length]);

  useEffect(() => {
    if (videoEl.current) {
      videoEl.current.srcObject = media?.stream;
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
        // screenshotIndex = screenshotIndex === 0 ? 1 : 0;

        // imgData = ctx.getImageData(0, 0, width, height);

        // const blendedImage = new ImageData(640, 480);

        // const length = imgData.data?.length | 0;
        // let x = 0;
        // while (x < length) {
        //   const currentFrameAveragePxVal =
        //     (imgData.data[x] + imgData.data[x + 1] + imgData.data[x + 2]) / 3;
        //   const prevFrameAveragePxVal =
        //     (imgDataPrev![screenshotIndex].data[x] +
        //       imgDataPrev![screenshotIndex].data[x + 1] +
        //       imgDataPrev![screenshotIndex].data[x + 2]) /
        //     3;
        //   const blended =
        //     alpha * (255 - currentFrameAveragePxVal) + (1 - alpha) * prevFrameAveragePxVal;

        //   blendedImage.data[x] = blended;
        //   blendedImage.data[x + 1] = blended;
        //   blendedImage.data[x + 2] = blended;
        //   blendedImage.data[x + 3] = 255;

        //   x += 4;
        // }

        // const removedAlphaImage = removeAlphaChannel(blendedImage);
        // setGreyPixelsCount(filterOutsideRange(range, removedAlphaImage).length);
        // (ctxFinal as CanvasRenderingContext2D).putImageData(blendedImage, 0, 0);
      }
    };

    const id = setInterval(snapshot, interval);

    return () => clearInterval(id);
  }, [video, range, interval]);

  const className = classnames('rounded-md');

  // TODO: рефакторинг
  useEffect(() => {
    setTimeout(() => {
      if (videoEl.current) {
        videoEl.current.muted = true;
      }
    }, 2000);
  }, [videoEl.current]);

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
      {/* <div>ACCEPTABLE_MOTION_PIXEL_COUNT: {ACCEPTABLE_MOTION_PIXEL_COUNT}</div>

      <div>range: {JSON.stringify(range)}</div>

      <div>interval: {interval}</div> */}

<video
        ref={videoElFake}
        width={videoWidth}
        // height={200}
        autoPlay
        muted
        className="rounded-md"
        style={{
          aspectRatio: cameraAspectRatio,
          // width: '100%',
          background: detected! ? token.colorErrorBg : token['blue-1'],
          boxShadow: `var(--tw-ring-inset) 0 0 0 ${detected! ? '4px' : '1px'} ${detected! ? token.colorError : token.colorPrimary}`,
        }}></video>

      <video
        ref={videoEl}
        hidden
        width={1280}
        autoPlay
        className="rounded-md"
        style={{
          aspectRatio: cameraAspectRatio,
          // width: '100%',
          background: detected! ? token.colorErrorBg : token['blue-1'],
          boxShadow: `var(--tw-ring-inset) 0 0 0 ${detected! ? '4px' : '1px'} ${detected! ? token.colorError : token.colorPrimary}`,
        }}></video>
      <canvas ref={canvas} width={width} height={height} hidden></canvas>
      <canvas
        ref={canvasFinal}
        width={width}
        height={height}
        className={className}
        hidden
        style={{
          background: detected! ? token.colorErrorBg : token['blue-1'],
          boxShadow: `var(--tw-ring-inset) 0 0 0 ${detected! ? '4px' : '1px'} ${detected! ? token.colorError : token.colorPrimary}`,
        }}></canvas>
    </div>
  );
};
