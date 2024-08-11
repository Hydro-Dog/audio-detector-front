export const drawVolumeLevel = ({
  canvasContext,
  volume,
}: {
  canvasContext: CanvasRenderingContext2D;
  volume: number;
}) => {
  const width = canvasContext.canvas.width;
  const height = canvasContext.canvas.height;
  const padding = 5; // Отступ для рамки вокруг полосы громкости

  // Очистка канваса для прозрачного фона
  canvasContext.clearRect(0, 0, width, height);

  // Настройка градиента (вертикальный)
  const gradient = canvasContext.createLinearGradient(0, height, 0, 0);
  gradient.addColorStop(0, '#20A4F3'); // Начальный цвет градиента внизу
  gradient.addColorStop(1, '#274060'); // Конечный цвет градиента вверху

  // Отрисовка полосы громкости
  canvasContext.fillStyle = gradient;
  canvasContext.beginPath();
  canvasContext.moveTo(padding, height - padding - (volume / 100) * (height - 2 * padding));
  canvasContext.lineTo(width - padding, height - padding - (volume / 100) * (height - 2 * padding));
  canvasContext.lineTo(width - padding, height - padding);
  canvasContext.lineTo(padding, height - padding);
  canvasContext.closePath();
  canvasContext.fill();

  // Отрисовка рамки
  //   canvasContext.strokeStyle = '#000'; // Цвет рамки
  //   canvasContext.lineWidth = 2; // Толщина линии рамки
  //   canvasContext.beginPath();
  //   canvasContext.moveTo(padding, padding);
  //   canvasContext.lineTo(width - padding, padding);
  //   canvasContext.lineTo(width - padding, height - padding);
  //   canvasContext.lineTo(padding, height - padding);
  //   canvasContext.closePath();
  //   canvasContext.stroke();
};
