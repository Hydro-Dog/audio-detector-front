import { theme as antdTheme } from 'antd';

const BARS_TOTAL = 20; // количество полосок в шкале громкости

type Props = {
  volumeLevel: number;
  thresholdLevel?: number;
};

export const VolumeLevelBarWidget = ({ volumeLevel, thresholdLevel }: Props) => {
  const { useToken } = antdTheme;
  const { token } = useToken();

  const bars = [];

  const getBarsToFillCount = (level: number) => Math.ceil((level / 100) * BARS_TOTAL);

  for (let i = 0; i < BARS_TOTAL; i++) {
    // Добавление полосок в массив: если текущий индекс меньше или равен вычисленному уровню громкости, полоска будет "заполнена"
    const barsToFillCount = getBarsToFillCount(volumeLevel);

    bars.push(
      <svg key={i} width="20" height="1">
        <rect
          width="20"
          height="1"
          style={{
            fill:
              i < barsToFillCount
                ? volumeLevel < thresholdLevel!
                  ? token.colorPrimary
                  : token.colorError
                : token['blue-1'],
          }}></rect>
      </svg>,
    );
  }

  return (
    <div
      className="h-56 w-8 flex justify-between flex-col items-center relative rounded-md p-2 -scale-100"
      style={{
        background: volumeLevel > thresholdLevel! ? token.colorErrorBg : token['blue-1'],
        border: `1px solid ${volumeLevel > thresholdLevel! ? token.colorError : token.colorPrimary}`,
      }}>
      {bars}
      {thresholdLevel && (
        <div className="absolute w-full h-full rounded-md p-1 top-0 right-0  -scale-100">
          <div
            className="absolute w-full top-0 right-0 bg-rose-600/20"
            style={{ height: `${100 - thresholdLevel}%` }}
          />
        </div>
      )}
    </div>
  );
};
