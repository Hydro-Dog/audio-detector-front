import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DETECTION_SOURCE } from '@shared/index';
import { Button, Typography, Tag, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useBoolean } from 'usehooks-ts';
import { DetectSettingsModal } from './components';
import { TimeLeftBlock } from './components/time-left-block';
import { DontCloseTabBlock } from './components/dont-close-tab-block';

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
  const monitoringScheduledInitialStatus = !localStorage.getItem('startOptions')
    ? 'idle'
    : JSON.parse(localStorage.getItem('startOptions'))?.startTime - Date.now() > 0
      ? 'scheduled'
      : 'running';

  const [monitoringStatus, setMonitoringStatus] = useState<'idle' | 'running' | 'scheduled'>(
    monitoringScheduledInitialStatus,
  );

  const handleOk = (startOptions: any) => {
    localStorage.setItem('startOptions', JSON.stringify(startOptions));
    setMonitoringStatus(startOptions?.startTime - Date.now() > 0 ? 'scheduled' : 'running');
    closeModal();
  };

  const buttonProps = useMemo(() => {
    switch (monitoringStatus) {
      case 'scheduled':
        return {
          children: t('CANCEL_START', { ns: 'phrases' }),
          danger: true,
          onClick: () => {
            localStorage.removeItem('startOptions');
            setMonitoringStatus('idle');
          },
        };
      case 'idle':
        return {
          children: t('START_MONITORING', { ns: 'phrases' }),
          danger: false,
          onClick: openModal,
        };
      case 'running':
        return {
          children: t('STOP_MONITORING', { ns: 'phrases' }),
          danger: true,
          onClick: () => {
            localStorage.removeItem('startOptions');
            setMonitoringStatus('idle');
          },
        };
      default:
        break;
    }
  }, [monitoringStatus, openModal, t]);

  const [timeLeft, setTimeLeft] = useState<string>('');
  useEffect(() => {
    const startOptionsJSON = localStorage.getItem('startOptions');
    const startOptions = JSON.parse(String(startOptionsJSON));
    // const monitoring = String(localStorage.getItem('monitoring'));

    if (monitoringStatus === 'scheduled') {
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
          setMonitoringStatus('running')
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [monitoringStatus]);

  const InfoBlock = () =>
    useMemo(() => {
      switch (monitoringStatus) {
        case 'scheduled':
          return <TimeLeftBlock timeLeft={timeLeft} />;
        case 'idle':
          return <></>;
        case 'running':
          return <DontCloseTabBlock />;
        default:
          return <></>;
      }
    }, []);

  return (
    <div className="flex justify-center mt-10">
      <div className="relative h-24">
        <div className="flex gap-2 flex-col items-center justify-center w-60">
          <Button size="large" style={{ width: '100%' }} {...buttonProps} />
        </div>
      </div>
      <InfoBlock />

      {isModalOpened && <DetectSettingsModal handleOk={handleOk} closeModal={closeModal} />}
    </div>
  );
};
