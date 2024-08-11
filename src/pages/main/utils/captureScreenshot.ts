import { MutableRefObject } from 'react';

type Args = {
  videoRef: MutableRefObject<HTMLVideoElement> | null;
  canvasRef: MutableRefObject<HTMLCanvasElement>;
};

export const captureScreenshot = ({ videoRef, canvasRef, videoW, videoH, canvasW, canvasH }: Args) => {
  const video = videoRef?.current;
  const canvas = canvasRef?.current;
  if (video && canvas && videoW && videoH && canvasW && canvasH) {

    // @ts-ignore
    canvas.width = videoW;
    // @ts-ignore
    canvas.height = videoH;
    const ctx = canvas.getContext('2d');
    // @ts-ignore
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  }
  return null;
};
