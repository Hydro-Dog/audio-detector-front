type DrawLinearSpectrogramArgs = {
  ctx: CanvasRenderingContext2D;
  volumeBars: number[];
  barWidth?: number;
};

export const drawLinearSpectrogram = ({
  ctx,
  volumeBars,
  barWidth = 10,
}: DrawLinearSpectrogramArgs) => {
  volumeBars.forEach((item, index) => {
    ctx.fillStyle = 'blue';
    ctx.fillRect(index * barWidth, 0, barWidth, item);
  });
};
