import { Button, Modal, Tooltip, Checkbox, Select, InputNumber } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { useBoolean } from 'usehooks-ts';

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

  const [currentOption, setCurrentOptions] = useState('now');
  const [startTimer, setStartTimer] = useState(0);
  const [activeDetectors, setActiveDetectors] = useState(['video', 'audio']);

  const options = [
    { label: 'Видео', value: 'video' },
    { label: 'Аудио', value: 'audio' },
  ];

  const handleOk = () => {
    localStorage.setItem(
      'startOptions',
      JSON.stringify({
        activeDetectors: activeDetectors,
        startTime: Date.now() + startTimer * 1000,
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
        const difference = JSON.parse(localStorage.getItem('startOptions'))?.startTime - now;

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
          {currentlyMonitoringInputs.length ? 'Выключить детектор' : 'Включить детектор'}
        </Button>
        <div>
          <div className="flex gap-2 items-center">
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

      <Modal
        title="Запуск"
        open={isModalOpened}
        onOk={handleOk}
        onCancel={closeModal}
        footer={[
          <Button key="back" onClick={closeModal}>
            Cancel
          </Button>,
          <Tooltip
            key="submit"
            title={
              !activeDetectors.length
                ? 'Выберите как минимум один вид детектирования: аудио или видео'
                : ''
            }>
            <Button type="primary" disabled={!activeDetectors.length} onClick={handleOk}>
              Ok
            </Button>
          </Tooltip>,
        ]}>
        <div className="flex flex-col gap-1">
          <Checkbox.Group options={options} value={activeDetectors} onChange={setActiveDetectors} />
          <div className="flex gap-1 items-center">
            <div>Запустить детектор</div>
            <Select
              variant="filled"
              style={{ width: 120 }}
              value={currentOption}
              onChange={(value) => {
                setCurrentOptions(value);
                if (value === 'now') {
                  setStartTimer(0);
                }
              }}
              options={[
                { value: 'now', label: 'сейчас' },
                { value: 'later', label: 'позже' },
              ]}
            />
          </div>
          {currentOption === 'later' && (
            <div className="flex gap-2 items-center">
              <div>через:</div>
              <InputNumber min={1} max={300} value={startTimer} onChange={setStartTimer} />
              <div>секунд</div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
