import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { DETECTION_SOURCE } from '@shared/index';
import { Button } from 'antd';
import { useBoolean } from 'usehooks-ts';
import { DetectSettingsModal } from './components';
import { DontCloseTabBlock } from './components/dont-close-tab-block';
import { TimeLeftBlock } from './components/time-left-block';

type Props = {
  monitoringStatus: 'idle' | 'running' | 'scheduled';
  setMonitoringStatus: Dispatch<SetStateAction<'idle' | 'running' | 'scheduled'>>;
  detectors: DETECTION_SOURCE[];
  setDetectors: Dispatch<SetStateAction<DETECTION_SOURCE[]>>;
};

export const StartDetectionComponent = ({
  monitoringStatus,
  setMonitoringStatus,
  detectors,
  setDetectors,
}: Props) => {
  const { t } = useTranslation();
  const { value: isModalOpened, setTrue: openModal, setFalse: closeModal } = useBoolean();

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
  }, [monitoringStatus, openModal, setMonitoringStatus, t]);

  const [timeLeft, setTimeLeft] = useState<string>('');
  useEffect(() => {
    const startOptionsJSON = localStorage.getItem('startOptions');
    const startOptions = JSON.parse(String(startOptionsJSON));

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
          setMonitoringStatus('running');
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
          <InfoBlock />
        </div>
      </div>

      <DetectSettingsModal
        isOpen={isModalOpened}
        handleOk={handleOk}
        closeModal={closeModal}
        detectors={detectors}
        setDetectors={setDetectors}
      />
    </div>
  );
};
