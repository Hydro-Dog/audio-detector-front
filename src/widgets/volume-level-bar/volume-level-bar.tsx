import { CSSProperties } from 'react';
import { useTheme } from '@shared/theme';
import { theme as antdTheme } from 'antd';

type Props = {
  volumeLevel: number;
};

export const VolumeLevelBarWidget = ({ volumeLevel }: Props) => {
  const { theme } = useTheme();
  const { useToken } = antdTheme;
  const { token } = useToken();

  const numBars = 20; // количество полосок в шкале громкости
  const bars = [];

  for (let i = 0; i < numBars; i++) {
    // Добавление полосок в массив: если текущий индекс меньше или равен вычисленному уровню громкости, полоска будет "заполнена"

    bars.push(
      <svg key={i} width="20" height="1">
        <rect
          width="20"
          height="1"
          style={{
            fill:
              i < Math.ceil((volumeLevel / 100) * numBars) ? token.colorPrimary : token['blue-1'],
          }}></rect>
      </svg>,
    );
  }

  return (
    <div
      style={{
        transform: 'scaleY(-1)',
        width: '30px', // ширина контейнера полосок
        height: '220px', // высота контейнера полосок
        display: 'flex', // для использования flexbox
        flexDirection: 'column', // элементы выравниваются с низу вверх
        justifyContent: 'space-between',
        alignItems: 'center', // центрирование полосок по горизонтали
        background: token['blue-1'],
        border: `1px solid ${token.colorPrimary}`,
        padding: '12px',
        borderRadius: token.borderRadius,
      }}>
      {bars}
    </div>
  );
};
