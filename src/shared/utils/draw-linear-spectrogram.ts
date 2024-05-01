type DrawLinearSpectrogramArgs = {
  canvasContext: CanvasRenderingContext2D;
  volumeBars: number[];
  barWidth?: number;
  maxBarHeight?: number;
};

export const drawLinearSpectrogram = ({
  canvasContext,
  volumeBars,
  barWidth = 10,
  maxBarHeight = 255,
}: DrawLinearSpectrogramArgs) => {
  const getColor = (value: number, max: number) => {
    const ratio = value / max;
    const hue = (1 - ratio) * 120; // 120 - зелёный, 0 - красный
    return `hsl(${hue}, 100%, 50%)`;
  };

  volumeBars.forEach((item, index) => {
    // canvasContext.fillStyle = 'blue';
    canvasContext.fillStyle = getColor(item, maxBarHeight);
    canvasContext.fillRect(index * barWidth, 0, barWidth, item);
  });
};

export const drawLinearSpectrogramApproximated = ({
  canvasContext,
  volumeBars,
  barWidth = 10,
}: DrawLinearSpectrogramArgs) => {
  const getColor = (value: number, max: number) => {
    const ratio = value / max;
    const hue = (1 - ratio) * 120; // 120 - зелёный, 0 - красный
    return `hsl(${hue}, 100%, 50%)`;
  };

  const maxBarHeight = 255;

  // Начинаем путь для кривой
  canvasContext.beginPath();
  // Начальная точка кривой на первом баре
  canvasContext.moveTo(0, maxBarHeight - volumeBars[0]);

  // Рисуем линии между вершинами баров
  volumeBars.forEach((item, index) => {
    const x = index * barWidth + barWidth / 2; // X координата центра бара
    const y = maxBarHeight - item; // Y координата вершины бара
    canvasContext.lineTo(x, y);
  });

  // Завершаем кривую на последнем баре
  canvasContext.lineTo(
    volumeBars.length * barWidth,
    maxBarHeight - volumeBars[volumeBars.length - 1],
  );

  // Устанавливаем стиль и цвет линии
  canvasContext.strokeStyle = 'black'; // Вы можете выбрать цвет или использовать функцию getColor()
  canvasContext.lineWidth = 2; // Толщина линии
  canvasContext.stroke(); // Рисуем линию

  // Отрисовка баров (опционально)
  volumeBars.forEach((item, index) => {
    const x = index * barWidth;
    const y = maxBarHeight - item;
    canvasContext.fillStyle = getColor(item, maxBarHeight);
    canvasContext.fillRect(x, maxBarHeight - item, barWidth, item);
  });
};
