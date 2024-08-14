/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createWsMessage, DETECTION_SOURCE } from '@shared/index';
import { AppDispatch, RootState, wsSend } from '@store/index';
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
  const { messages } = useSelector((state: RootState) => state.ws);
  const dispatch = useDispatch<AppDispatch>();

  const handleOk = (startOptions: any) => {
    localStorage.setItem('startOptions', JSON.stringify(startOptions));
    setMonitoringStatus(startOptions?.startTime - Date.now() > 0 ? 'scheduled' : 'running');

    dispatch(wsSend(createWsMessage({
          type: 'monitoring',
          code: 'monitoring_set',
          payload: { startOptions: startOptions },
        }),
      ),
    );
    closeModal();
  };

  const handleStop = () => {
    localStorage.removeItem('startOptions');
    setMonitoringStatus('idle');
    // @ts-ignore
    dispatch(wsSend(createWsMessage({ type: 'monitoring', code: 'monitoring_stopped' })));
  };

  const handleCancelSchedule = () => {
    localStorage.removeItem('startOptions');
    setMonitoringStatus('idle');
    // @ts-ignore
    dispatch(wsSend(createWsMessage({ type: 'monitoring', code: 'monitoring_schedule_canceled' })));
  };

  const buttonProps = useMemo(() => {
    switch (monitoringStatus) {
      case 'scheduled':
        return {
          children: t('CANCEL_START', { ns: 'phrases' }),
          danger: true,
          onClick: handleCancelSchedule,
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
          onClick: handleStop,
        };
      default:
        break;
    }
  }, [handleCancelSchedule, handleStop, monitoringStatus, openModal, t]);

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

  useEffect(() => {
    const message = messages[messages.length - 1];
    if (message?.code === 'start_monitoring' && monitoringStatus !== 'running') {
      const payload = JSON.parse(message?.payload);
      handleOk(payload);
    } else if (message?.code === 'stop_monitoring' && monitoringStatus === 'running') {
      handleStop();
    } else if (message?.code === 'stop_monitoring' && monitoringStatus === 'scheduled') {
      handleCancelSchedule();
    }
  }, [messages.length]);

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
    <div className="flex justify-center mt-10 z-10">
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
