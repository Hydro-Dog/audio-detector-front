import { useSendAlertHook } from '@shared/hooks/index';
import { useMediaContext } from '@shared/index';
import { VideoComponent, VolumeLevelBarWidget } from '@widgets/index';
import { Button } from 'antd';
import { useBoolean } from 'usehooks-ts';
import { AudioSettingsModal } from './audio-settings-modal';

export const MainPage = () => {
  const { value: isModalOpened, setTrue: openModal, setFalse: closeModal } = useBoolean(false);
  const { capturedVolumeLevel, isListening, toggleIsListening, thresholdVolumeLevelNormalized } =
    useMediaContext();

  useSendAlertHook({
    currentVolumeLevel: capturedVolumeLevel,
    thresholdVolumeLevel: thresholdVolumeLevelNormalized,
    isListening,
  });

  return (
    <div className="flex w-full h-screen">
      <div className="m-auto w-fit">
        <Button onClick={toggleIsListening}>{isListening ? 'Stop' : 'Start'} Listen Mic</Button>
        <VolumeLevelBarWidget
          volumeLevel={capturedVolumeLevel}
          thresholdLevel={thresholdVolumeLevelNormalized}
        />
        <Button onClick={openModal}>Settings</Button>
        <VideoComponent />
        <AudioSettingsModal isModalOpened={isModalOpened} onOk={closeModal} onCancel={closeModal} />
      </div>
    </div>
  );
};
