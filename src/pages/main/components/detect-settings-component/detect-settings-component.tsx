import { useState, useEffect, useRef } from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNotificationContext, useThemeToken } from '@shared/index';
import {
  Button,
  Modal,
  Tooltip,
  Checkbox,
  Select,
  InputNumber,
  TimePicker,
  DatePicker,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useBoolean } from 'usehooks-ts';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DetectSettingsModal } from './components';

const { Text } = Typography;

const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

type Props = {
  currentlyMonitoringInputs: any;
  setCurrentlyMonitoringInputs: any;
};

export const DetectSettingsComponent = ({
  currentlyMonitoringInputs,
  setCurrentlyMonitoringInputs,
}: Props) => {
  const { value: isModalOpened, setTrue: openModal, setFalse: closeModal } = useBoolean();
  const [start, setStart] = useState(false);
  const token = useThemeToken();
  const [activeDetectors, setActiveDetectors] = useState(['video', 'audio']);
  const { value: isTimeValid, setTrue: setTimeValid, setFalse: setTimeInvalid } = useBoolean();

  const [currentOption, setCurrentOptions] = useState('now');
  const [startTime, setStartTime] = useState(0);
  const { openNotification } = useNotificationContext();


  // console.log('startDate: ', startDate);
  const options = [
    { label: 'Камера', value: 'video' },
    { label: 'Микрофон', value: 'audio' },
  ];

  console.log('startTime: ', startTime)

  const handleOk = () => {
    console.log('new Date(startTime.valueOf()): ', new Date(startTime.valueOf()))
    localStorage.setItem(
      'startOptions',
      JSON.stringify({
        activeDetectors: activeDetectors,
        startTime: startTime ? new Date(startTime.valueOf()) : new Date(),
      }),
    );
    localStorage.setItem('monitoring', JSON.stringify(activeDetectors));
    setStart(true);
    closeModal();
  };

  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isMonitoing, setIsMonitoing] = useState(false);

  useEffect(() => {
    setStart(false);
    if (JSON.parse(localStorage.getItem('startOptions'))?.startTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const difference = new Date(JSON.parse(localStorage.getItem('startOptions'))?.startTime) - now;

        console.log('difference: ', difference)
        if (difference > 0) {
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          setTimeLeft(`${minutes ? `${minutes}м ` : ''}${seconds}с`);
        } else {
          setTimeLeft(null);

          if (localStorage.getItem('monitoring')) {
            console.log(`2 START DETECTING BY: ${localStorage.getItem('monitoring')}`);
            setCurrentlyMonitoringInputs(localStorage.getItem('monitoring'));
            setIsMonitoing(true);
          }

          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [start]);

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

  const onAudioAlert = () => {
    if (currentlyMonitoringInputs.includes('audio')) {
    }
  };
  const onVideoAlert = () => {
    console.log('Video Alert!');
    // if (currentlyMonitoringInputs.includes('video')) {
    const base64Image = captureScreenshot();
    console.log('Video Alert: Screenshot captured', base64Image);
    // }
  };

  const disabledDate = (current) => {
    // Отключить даты до текущей
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current && current.valueOf() < today.getTime();
  };

  const disabledTime = (current) => {
    // Только отключить время для текущей даты
    if (!current || current.format('YYYY-MM-DD') !== new Date().toISOString().slice(0, 10)) {
      return {};
    }

    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const currentSecond = new Date().getSeconds();

    return {
      disabledHours: () => range(0, currentHour),
      disabledMinutes: () => range(0, currentMinute),
      disabledSeconds: () => range(0, currentSecond),
    };
  };

  let a = JSON.parse(localStorage.getItem('startOptions'))?.startTime

  return (
    <>
      <video ref={videoRef} style={{ display: 'none' }} autoPlay />

      <div className="flex gap-1 flex-col items-center mb-8 justify-center">
        <Button
          size="large"
          danger={!!currentlyMonitoringInputs.length}
          onClick={() => {
            if (currentlyMonitoringInputs.length) {
              localStorage.removeItem('startOptions');
              localStorage.removeItem('monitoring');
              setCurrentlyMonitoringInputs([]);
            } else {
              openModal();
            }
          }}>
          {currentlyMonitoringInputs.length ? 'Остановить наблюдение' : 'Запустить наблюдение'}
        </Button>
        <div>
          <div className="flex gap-2 items-center">
            {timeLeft && dayjs(a).utc().format('DD MMMM YYYY, HH:mm:ss')}
            {timeLeft && <div>через: {timeLeft}</div>}
            {timeLeft && (
              <Button
                onClick={() => {
                  localStorage.removeItem('startOptions');
                  localStorage.removeItem('monitoring');
                  setCurrentlyMonitoringInputs([]);
                }}>
                Отменить
              </Button>
            )}
          </div>
        </div>
      </div>

      {isModalOpened && (
        <DetectSettingsModal
          startTime={startTime}
          setStartTime={setStartTime}
          activeDetectors={activeDetectors} 
          setActiveDetectors={setActiveDetectors}
          setStart={setStart}
          closeModal={closeModal}
          handleOk={handleOk}
        />
      )}
    </>
  );
};
