import { useState, useEffect } from 'react';
import { DETECTION_SOURCE } from '@shared/index';
import { Button, Typography, Tag, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useBoolean } from 'usehooks-ts';
import { DetectSettingsModal } from './components';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

type Props = {
  currentlyMonitoringInputs: DETECTION_SOURCE[];
  setCurrentlyMonitoringInputs: (value: DETECTION_SOURCE[]) => void;
};

export const DetectSettingsComponent = ({
  currentlyMonitoringInputs,
  setCurrentlyMonitoringInputs,
}: Props) => {
  const { t } = useTranslation();
  const { value: isModalOpened, setTrue: openModal, setFalse: closeModal } = useBoolean();
  const [start, setStart] = useState(false);
  const [activeDetectors, setActiveDetectors] = useState([
    DETECTION_SOURCE.VIDEO,
    DETECTION_SOURCE.AUDIO,
  ]);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);

  const handleOk = () => {
    console.log('::::startTime: ', new Date(startTime))
    localStorage.setItem(
      'startOptions',
      JSON.stringify({
        activeDetectors: activeDetectors,
        startTime: startTime ? new Date(startTime) : new Date(),
      }),
    );
    localStorage.setItem('monitoring', JSON.stringify(activeDetectors));
    setStart(true);
    closeModal();
  };

  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    setStart(false);
    const startOptionsJSON = localStorage.getItem('startOptions');
    const startOptions = JSON.parse(String(startOptionsJSON));
    const monitoring = String(localStorage.getItem('monitoring'));

    if (startOptions?.startTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        //@ts-ignore
        const difference = new Date(startOptions?.startTime) - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          //TODO: добавить переврды букв ч, м, с
          setTimeLeft(
            `${days ? `${days}д ` : ''}${hours ? `${hours}ч ` : ''}${minutes ? `${minutes}м ` : ''}${seconds}с`,
          );
        } else {
          setTimeLeft('');
          setStartTime('');

          if (monitoring) {
            setCurrentlyMonitoringInputs(monitoring as unknown as DETECTION_SOURCE[]);
          }

          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [setCurrentlyMonitoringInputs, start]);

  const startOptions = JSON.parse(String(localStorage.getItem('startOptions')))?.startTime;

  return (
    <div className="flex justify-center mt-10">
      <div className="relative h-24">
        <div className="flex gap-2 flex-col items-center justify-center w-60">
          <Button
            size="large"
            style={{ width: '100%' }}
            danger={!!currentlyMonitoringInputs.length || !!startTime}
            onClick={() => {
              if (!!startTime) {
                localStorage.removeItem('startOptions');
                localStorage.removeItem('monitoring');
                setTimeLeft('');
                setStartTime('');
                setCurrentlyMonitoringInputs([]);
              } else if (currentlyMonitoringInputs.length) {
                localStorage.removeItem('startOptions');
                localStorage.removeItem('monitoring');
                setCurrentlyMonitoringInputs([]);
              } else {
                openModal();
              }
            }}>
            {!!startTime
              ? t('CANCEL', { ns: 'phrases' })
              : !!currentlyMonitoringInputs.length
                ? t('STOP_MONITORING', { ns: 'phrases' })
                : t('START_MONITORING', { ns: 'phrases' })}
          </Button>

          {!!currentlyMonitoringInputs.length && (
            <Tooltip
              className="cursor-pointer"
              title={t('VIDEO_DETECTOR_SETTINGS.DONT_CLOSE_THAT_TAB_TOOLTIP')}>
              <Tag color="blue" className="w-full whitespace-normal m-0 text-center ">
                {t('DONT_CLOSE_THAT_TAB', { ns: 'phrases' })}
              </Tag>
            </Tooltip>
          )}

          {!!startTime && (
            <div className="flex gap-2 w-full flex-col items-center">
              <Tag className="w-full m-0 text-center">
                <div>
                  <Text type="secondary">{t('LAUNCH', { ns: 'phrases' })}: </Text>
                  {dayjs(startOptions).format('DD MMMM YYYY, HH:mm:ss')}
                </div>
                <div>
                  <Text type="secondary">{t('LEFT', { ns: 'phrases' })}: </Text>
                  {timeLeft}
                </div>
              </Tag>
            </div>
          )}
        </div>
      </div>

      {isModalOpened && (
        <DetectSettingsModal
          handleOk={handleOk}
          activeDetectors={activeDetectors}
          setActiveDetectors={setActiveDetectors}
          setStartTime={setStartTime}
          startTime={startTime}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};
