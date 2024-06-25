import { useEffect, useRef, useState } from 'react';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Button, Checkbox, InputNumber, Modal, Select, Tooltip } from 'antd';
import { useBoolean, useDebounceCallback } from 'usehooks-ts';
import { VideoDetectorComponent, AudioDetectorComponent } from './components';
import './main.css';
import { DetectSettingsComponent } from './components/detect-settings-component/detect-settings-component';
import useThrottle from '@shared/hooks/use-throttle';
import { useDispatch } from 'react-redux';
import { AppDispatch, sendAlert } from '@store/index';

export const MainPage = () => {
  // const { value: isModalOpened, setTrue: openModal, setFalse: closeModal } = useBoolean();
  // const [start, setStart] = useState(false);

  // const [currentOption, setCurrentOptions] = useState('now');
  // const [startTimer, setStartTimer] = useState(0);
  // const [activeDetectors, setActiveDetectors] = useState(['video', 'audio']);

  // const options = [
  //   { label: 'Видео', value: 'video' },
  //   { label: 'Аудио', value: 'audio' },
  // ];

  // const handleOk = () => {
  //   localStorage.setItem(
  //     'startOptions',
  //     JSON.stringify({
  //       activeDetectors: activeDetectors,
  //       startTime: Date.now() + startTimer * 1000,
  //     }),
  //   );
  //   localStorage.setItem('monitoring', JSON.stringify(activeDetectors));
  //   setStart(true);
  //   closeModal();
  // };

  // const [timeLeft, setTimeLeft] = useState<string>('');
  // const [isMonitoing, setIsMonitoing] = useState(false);

  const [currentlyMonitoringInputs, setCurrentlyMonitoringInputs] = useState([]);

  // useEffect(() => {
  //   setStart(false);
  //   if (JSON.parse(localStorage.getItem('startOptions'))?.startTime) {
  //     const interval = setInterval(() => {
  //       const now = Date.now();
  //       const difference = JSON.parse(localStorage.getItem('startOptions'))?.startTime - now;

  //       if (difference > 0) {
  //         const minutes = Math.floor((difference / 1000 / 60) % 60);
  //         const seconds = Math.floor((difference / 1000) % 60);
  //         setTimeLeft(`${minutes ? `${minutes}м ` : ''}${seconds}с`);
  //       } else {
  //         setTimeLeft(null);

  //         if (localStorage.getItem('monitoring')) {
  //           console.log(`2 START DETECTING BY: ${localStorage.getItem('monitoring')}`);
  //           setCurrentlyMonitoringInputs(localStorage.getItem('monitoring'));
  //           setIsMonitoing(true);
  //         }

  //         clearInterval(interval);
  //       }
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  // }, [start]);

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing the webcam', error);
      }
    };

    getUserMedia();
  }, []);

  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));

  const captureScreenshot = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png');
    }
    return null;
  };

  const dispatch = useDispatch<AppDispatch>();

  const onAudioAlert = () => {
    if (currentlyMonitoringInputs.includes('audio')) {
      const base64Image = captureScreenshot()!;
      console.log('Audio Alert: Screenshot captured', base64Image);
      dispatch(sendAlert({ type: 'audio', image: base64Image }));
    }
  };

  const onVideoAlert = () => {
    if (currentlyMonitoringInputs.includes('video')) {
      const base64Image = captureScreenshot();
      console.log('Video Alert: Screenshot captured', base64Image);
      dispatch(sendAlert({ type: 'video', image: base64Image }));
    }
  };

  const debouncedAudioAlert = useThrottle(onAudioAlert, 5000);
  const debouncedVideoAlert = useThrottle(onVideoAlert, 5000);

  return (
    <div className="flex w-full h-screen">
      <div className="m-auto flex flex-col gap-3">
        <video ref={videoRef} style={{ display: 'none' }} autoPlay />

        <DetectSettingsComponent
          currentlyMonitoringInputs={currentlyMonitoringInputs}
          setCurrentlyMonitoringInputs={setCurrentlyMonitoringInputs}
        />

        <div className="flex flex-row-reverse gap-3">
          <div className="relative">
            {currentlyMonitoringInputs?.includes('audio') && (
              <RadioButtonCheckedIcon className="absolute left-0 -top-8 animated-icon ml-1" />
            )}
            <AudioDetectorComponent onAlert={debouncedAudioAlert} />
          </div>
          <div className="relative">
            {currentlyMonitoringInputs?.includes('video') && (
              <RadioButtonCheckedIcon className="absolute left-0 -top-8 animated-icon ml-1" />
            )}
            <VideoDetectorComponent onAlert={debouncedVideoAlert} />
          </div>
        </div>
      </div>
    </div>
  );
};
