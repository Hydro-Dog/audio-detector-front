/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import useThrottle from '@shared/hooks/use-throttle';
import { createWsMessage, DETECTION_SOURCE } from '@shared/index';
import { AppDispatch, RootState, sendAlarm, wsSend } from '@store/index';
import { Button } from 'antd';
import { useBoolean } from 'usehooks-ts';
import { Detectors } from './components/detectors';
import { StartDetectionComponent } from './components/start-monitoring-component/start-monitoring-component';
import { useMonitoringState } from './hooks';
import { useSetupMediaForScreenShot } from './hooks/use-setup-media-for-screenshot';
import { captureScreenshot } from './utils';

const alarmAudio = new Audio('/src/audio/alarm.wav');

export const MainPage = () => {
  const { t } = useTranslation();
  const { monitoringStatus, setMonitoringStatus } = useMonitoringState();
  const [detectors, setDetectors] = useState([DETECTION_SOURCE.VIDEO, DETECTION_SOURCE.AUDIO]);
  const {
    value: isStopAlarmDisplayed,
    setTrue: showStopAlarm,
    setFalse: hideShowAlarm,
  } = useBoolean(!!localStorage.getItem('alarmOn'));
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { messages } = useSelector((state: RootState) => state.ws);

  useSetupMediaForScreenShot(videoRef.current!);

  useEffect(() => {
    if (localStorage.getItem('alarmOn')) {
      setTimeout(() => {
        alarmAudio.play();
        alarmAudio.addEventListener('ended', () => {
          if (localStorage.getItem('alarmOn')) {
            alarmAudio.play();
          }
        });
        showStopAlarm();
      }, 500);
    }
  }, [showStopAlarm]);

  useEffect(() => {
    const message = messages[messages.length - 1];
    if (message?.code === 'start_alarm' && !localStorage.getItem('alarmOn')) {
      alarmAudio.play();
      localStorage.setItem('alarmOn', 'true');
      showStopAlarm();
      alarmAudio.addEventListener('ended', () => {
        if (localStorage.getItem('alarmOn')) {
          alarmAudio.play();
        }
      });
      // @ts-ignore
      dispatch(
        wsSend(
          createWsMessage({
            type: 'alarm',
            code: 'alarm_start',
          }),
        ),
      );
    } else if (message?.code === 'stop_alarm') {
      localStorage.removeItem('alarmOn');
      alarmAudio.pause();
      hideShowAlarm();
      // @ts-ignore
      dispatch(
        wsSend(
          createWsMessage({
            type: 'alarm',
            code: 'alarm_stopped',
          }),
        ),
      );
    }
  }, [messages.length]);

  const onAudioAlert = () => {
    if (monitoringStatus === 'running' && detectors.includes(DETECTION_SOURCE.AUDIO)) {
      const base64Image = captureScreenshot({
        // @ts-ignore
        videoRef,
        canvasRef,
      });
      dispatch(sendAlarm({ type: 'audio', image: base64Image }));
    }
  };

  const onVideoAlert = () => {
    if (monitoringStatus === 'running' && detectors.includes(DETECTION_SOURCE.VIDEO)) {
      const base64Image = captureScreenshot({
        // @ts-ignore
        videoRef,
        canvasRef,
      });
      dispatch(sendAlarm({ type: 'video', image: base64Image }));
    }
  };

  const debouncedAudioAlert = useThrottle(onAudioAlert, 5000);
  const debouncedVideoAlert = useThrottle(onVideoAlert, 5000);

  return (
    <div className="flex w-full justify-center h-screen">
      <div className="flex flex-col items-center gap-3">
        {isStopAlarmDisplayed ? (
          <div className="flex justify-center w-60 z-10">
            <Button
              size="large"
              danger
              className="mt-10 mb-14 w-full bg-rose-600/20 flex justify-center"
              icon={<StopCircleIcon />}
              onClick={() => {
                hideShowAlarm();
                localStorage.removeItem('alarmOn');
                alarmAudio.pause();
              }}>
              {t('TURN_OFF', { ns: 'phrases' })}
            </Button>
          </div>
        ) : (
          <StartDetectionComponent
            monitoringStatus={monitoringStatus}
            setMonitoringStatus={setMonitoringStatus}
            detectors={detectors}
            setDetectors={setDetectors}
          />
        )}

        <video ref={videoRef} className="absolute top-0" style={{ opacity: 0 }} autoPlay />
        <canvas ref={canvasRef} style={{ width: '1000px', height: '1000px' }} className="hidden" />

        <Detectors
          detectors={detectors}
          onVideoAlert={debouncedVideoAlert}
          onAudioAlert={debouncedAudioAlert}
          monitoringStatus={monitoringStatus}
        />
      </div>
    </div>
  );
};
