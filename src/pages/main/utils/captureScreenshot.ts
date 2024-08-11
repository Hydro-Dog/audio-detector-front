import { MutableRefObject } from 'react';

type Args = {
  videoRef: MutableRefObject<HTMLVideoElement> | null;
  canvasRef: MutableRefObject<HTMLCanvasElement>;
};

export const captureScreenshot = ({ videoRef, canvasRef }: Args) => {
  if (videoRef?.current && canvasRef.current) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    // @ts-ignore
    canvas.width = video.videoWidth;
    // @ts-ignore
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    console.log('video: ', video, canvas.width, canvas.height);
    // @ts-ignore
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  }
  return null;
};
