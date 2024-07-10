import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useThrottle from '@shared/hooks/use-throttle';
import { DETECTION_SOURCE } from '@shared/index';
import { AppDispatch, sendAlarm } from '@store/index';
import { Detectors } from './components/detectors';
import { StartDetectionComponent } from './components/start-monitoring-component/start-monitoring-component';
import { useMonitoringState } from './hooks';
import { useSetupMediaForScreenShot } from './hooks/use-setup-media-for-screenshot';
import { captureScreenshot } from './utils';

export const MainPage = () => {
  const { monitoringStatus, setMonitoringStatus } = useMonitoringState();
  const [detectors, setDetectors] = useState([DETECTION_SOURCE.VIDEO, DETECTION_SOURCE.AUDIO]);
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const dispatch = useDispatch<AppDispatch>();

  useSetupMediaForScreenShot(videoRef.current!);

  const onAudioAlert = () => {
    if (monitoringStatus === 'running' && detectors.includes(DETECTION_SOURCE.AUDIO)) {
      const base64Image = captureScreenshot({
        videoEl: videoRef.current!,
        canvasEl: canvasRef.current,
      });
      dispatch(sendAlarm({ type: 'audio', image: base64Image }));
    }
  };

  const onVideoAlert = () => {
    if (monitoringStatus === 'running' && detectors.includes(DETECTION_SOURCE.VIDEO)) {
      const base64Image = captureScreenshot({
        videoEl: videoRef.current!,
        canvasEl: canvasRef.current,
      });
      dispatch(sendAlarm({ type: 'video', image: base64Image }));
    }
  };

  const debouncedAudioAlert = useThrottle(onAudioAlert, 5000);
  const debouncedVideoAlert = useThrottle(onVideoAlert, 5000);

  return (
    <div className="flex w-full justify-center h-screen">
      <div className="flex flex-col gap-3">
        <video ref={videoRef} style={{ display: 'none' }} autoPlay />

        <StartDetectionComponent
          monitoringStatus={monitoringStatus}
          setMonitoringStatus={setMonitoringStatus}
          detectors={detectors}
          setDetectors={setDetectors}
        />

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
