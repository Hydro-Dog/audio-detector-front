import { theme as antdTheme } from 'antd';

const BARS_TOTAL = 20; // количество полосок в шкале громкости

type Props = {
  volumeLevel: number;
};

export const VolumeLevelBarWidget = ({ volumeLevel }: Props) => {
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
                ? BARS_TOTAL - barsToFillCount >= 3
                  ? token.colorPrimary
                  : token.colorError
                : token['blue-1'],
          }}></rect>
      </svg>,
    );
  }

  return (
    <div
      className="h-56 w-8 flex justify-between flex-col items-center"
      style={{
        transform: 'scaleY(-1)',
        background: token['blue-1'],
        border: `1px solid ${token.colorPrimary}`,
        padding: '12px',
        borderRadius: token.borderRadius,
      }}>
      {bars}
    </div>
  );
};
