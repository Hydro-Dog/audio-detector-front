import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import useThrottle from '@shared/hooks/use-throttle';
import { DETECTION_SOURCE } from '@shared/index';
import { AppDispatch, sendAlert } from '@store/index';
import { VideoDetectorComponent, AudioDetectorComponent } from './components';
import './main.css';
import { DetectSettingsComponent } from './components/detect-settings-component/detect-settings-component';
import classNames from 'classnames';
import { useWindowSize } from 'usehooks-ts';
import { SCREEN_SIZE } from '@shared/enum/screen-size';

export const MainPage = () => {
  const { width } = useWindowSize();
  const [currentlyMonitoringInputs, setCurrentlyMonitoringInputs] = useState<DETECTION_SOURCE[]>(
    [],
  );
  const dispatch = useDispatch<AppDispatch>();
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // @ts-ignore
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing the webcam', error);
      }
    };

    getUserMedia();
  }, []);

  const captureScreenshot = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      // @ts-ignore
      canvas.width = video.videoWidth;
      // @ts-ignore
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      // @ts-ignore
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png');
    }
    return null;
  };

  const onAudioAlert = () => {
    if (currentlyMonitoringInputs.includes(DETECTION_SOURCE.AUDIO)) {
      const base64Image = captureScreenshot()!;
      console.log('Audio Alert: Screenshot captured', base64Image);
      dispatch(sendAlert({ type: 'audio', image: base64Image }));
    }
  };

  const onVideoAlert = () => {
    if (currentlyMonitoringInputs.includes(DETECTION_SOURCE.VIDEO)) {
      const base64Image = captureScreenshot();
      console.log('Video Alert: Screenshot captured', base64Image);
      dispatch(sendAlert({ type: 'video', image: base64Image }));
    }
  };

  const debouncedAudioAlert = useThrottle(onAudioAlert, 5000);
  const debouncedVideoAlert = useThrottle(onVideoAlert, 5000);

  const containerClasses = classNames(
    'flex h-80 gap-3',
    width > SCREEN_SIZE.MD ? 'flex-row-reverse' : 'flex-col',
  );

  const audioRecordIconClasses = classNames(
    'absolute animated-icon',
    width > SCREEN_SIZE.MD ? 'left-0 -top-8 ml-1' : '-left-8 top-1 ml-1',
  );

  return (
    <div className="flex w-full h-screen">
      <div className="m-auto flex flex-col gap-3">
        <video ref={videoRef} style={{ display: 'none' }} autoPlay />

        <DetectSettingsComponent
          currentlyMonitoringInputs={currentlyMonitoringInputs}
          setCurrentlyMonitoringInputs={setCurrentlyMonitoringInputs}
        />

        <div className={containerClasses}>
          <div className="relative">
            {currentlyMonitoringInputs?.includes(DETECTION_SOURCE.AUDIO) && (
              <RadioButtonCheckedIcon className={audioRecordIconClasses} />
            )}
            <AudioDetectorComponent onAlert={debouncedAudioAlert} />
          </div>
          <div>Video</div>
          {/* <div className="relative">
            {currentlyMonitoringInputs?.includes(DETECTION_SOURCE.VIDEO) && (
              <RadioButtonCheckedIcon className="absolute left-0 -top-8 animated-icon ml-1" />
            )}
            <VideoDetectorComponent onAlert={debouncedVideoAlert} />
          </div> */}
        </div>
      </div>
    </div>
  );
};
