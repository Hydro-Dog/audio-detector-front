import { useThemeToken } from '@shared/index';
import classnames from 'classnames';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useEffect } from 'react';

const BARS_TOTAL = 40; // количество полосок в шкале громкости

type Props = {
  volumeLevel?: number;
  thresholdLevel?: number;
  showArrow?: boolean;
  onAlert?: () => void
};

export const VolumeLevelBarWidget = ({ volumeLevel = 0, thresholdLevel, showArrow, onAlert }: Props) => {
  const token = useThemeToken();

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

  const className = classnames(
    'h-full w-8 flex justify-between flex-col items-center relative rounded-md p-2 -scale-100  ring-4',
    { 'ring-red-400 ': volumeLevel > thresholdLevel! },
  );

  useEffect(() => {
    if(volumeLevel > thresholdLevel!) {
      onAlert();
    }
  }, [volumeLevel, thresholdLevel])

  return (
    <div
      className={className}
      style={{
        background: volumeLevel > thresholdLevel! ? token.colorErrorBg : token['blue-1'],
        boxShadow: `var(--tw-ring-inset) 0 0 0 ${volumeLevel > thresholdLevel! ? '4px' : '1px'} ${volumeLevel > thresholdLevel! ? token.colorError : token.colorPrimary}`,
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
      {showArrow && (
        <KeyboardArrowLeftIcon
          className="-scale-100"
          sx={{
            position: 'absolute',
            top: `calc(${thresholdLevel}% - 12px)`,
            right: '48px',
            color: token['magenta-4'],
            background: token['magenta-1'],
            borderRadius: '4px',
            border: `1px solid ${token['magenta-4']}`,
          }}
        />
      )}
    </div>
  );
};
