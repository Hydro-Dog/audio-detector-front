/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { useMediaContext } from '@shared/index';

const filterRange = (range: { min: number; max: number }, values: Uint8ClampedArray): Uint8Array => {
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
}

const removeAlphaChannel = (imageData: ImageData) => {
  const data = imageData.data;
  const length = data.length;
  const rgbData = new Uint8Array((length / 4) * 3); // Новый массив для хранения только RGB-компонентов
  let rgbIndex = 0;

  for (let i = 0; i < length; i += 4) {
    // Копируем только RGB-компоненты
    rgbData[rgbIndex++] = data[i];     // Red
    rgbData[rgbIndex++] = data[i + 1]; // Green
    rgbData[rgbIndex++] = data[i + 2]; // Blue
    // Пропускаем альфа-канал (data[i + 3])
  }

  return rgbData;
}

const DELTA = 921000;

export const VideoComponent = () => {
  const alpha = 0.5;
  let screenshotIndex = 0;

  const canvas = useRef<HTMLCanvasElement>(null);
  const canvasFinal = useRef<HTMLCanvasElement>(null);
  const videoEl = useRef<HTMLVideoElement>(null);

  let imgData: ImageData | null = null;
  const imgDataPrev: ImageData[] | null = [];

  const { stream } = useMediaContext();

  const [video, setVideo] = useState<HTMLVideoElement>();
  const [resultBlendedImageData, setResultBlendedImageData] = useState<Uint8Array>(
    new Uint8Array(),
  );

  useEffect(() => {
    if (Math.abs(DELTA - resultBlendedImageData.length) > 10000) {
      console.log('detected');
    }
  }, [resultBlendedImageData.length, (imgData as unknown as ImageData)?.data.length]);

  useEffect(() => {
    if (videoEl.current) {
      videoEl.current.srcObject = stream;
      setVideo(videoEl.current);
    }
  }, [stream]);

  useEffect(() => {
    function snapshot() {
      if (video && canvas.current && canvasFinal.current) {
        const width = canvas.current.width;
        const height = canvas.current.height;
        const ctx = canvas.current.getContext('2d')!;
        const ctxFinal = canvasFinal.current.getContext('2d');

        ctx.drawImage(video, 0, 0, width, height);

        imgDataPrev![screenshotIndex] = ctx.getImageData(0, 0, width, height);
        screenshotIndex = screenshotIndex === 0 ? 1 : 0;

        imgData = ctx.getImageData(0, 0, width, height);

        const blendedImage = new ImageData(640, 480);

        const length = imgData.data?.length | 0;
        let x = 0;
        while (x < length) {
          // GreyScale.
          const currentFrameAveragePxVal =
            (imgData.data[x] + imgData.data[x + 1] + imgData.data[x + 2]) / 3;
          //imgDataPrev[screenshotIndex].data[x]
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

        setResultBlendedImageData(filterRange({ min: 124, max: 134 }, blendedImage.data));
        (ctxFinal as CanvasRenderingContext2D).putImageData(blendedImage, 0, 0);
      }
    }
    setInterval(snapshot, 32);
  }, [video]);

  return (
    <div>
      <video ref={videoEl} width={640} height={480} autoPlay hidden></video>
      <canvas ref={canvas} width={640} height={480} hidden></canvas>
      <canvas ref={canvasFinal} width={640} height={480}></canvas>
    </div>
  );
};