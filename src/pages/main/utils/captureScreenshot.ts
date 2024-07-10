type Args = {
  videoEl: HTMLVideoElement;
  canvasEl: HTMLCanvasElement;
};

export const captureScreenshot = ({ videoEl, canvasEl }: Args) => {
  if (videoEl) {
    const video = videoEl;
    const canvas = canvasEl;
    // @ts-ignore
    canvas.width = video.videoWidth;
    // @ts-ignore
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    // @ts-ignore
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  }
  return null;
};
