import { useSendAlertHook } from '@shared/hooks/index';
import { useAudioContext } from '@shared/index';
import { VolumeLevelBarWidget } from '@widgets/index';
import { Button } from 'antd';
import { useBoolean } from 'usehooks-ts';
import { AudioSettingsModal } from './audio-settings-modal';

export const MainPage = () => {
  const { value: isModalOpened, setTrue: openModal, setFalse: closeModal } = useBoolean(false);
  const {
    capturedVolumeLevel,
    isMicOn,
    toggleMic,
    isListening,
    toggleIsListening,
    thresholdVolumeLevelNormalized,
  } = useAudioContext();

  useSendAlertHook({
    currentVolumeLevel: capturedVolumeLevel,
    thresholdVolumeLevel: thresholdVolumeLevelNormalized,
    isListening,
  });

  return (
    <div className="flex w-full h-screen">
      <div className="m-auto w-fit">
        {/* <Button onClick={toggleMic}>{isMicOn ? 'Off' : 'On'}</Button> */}
        <Button onClick={toggleIsListening}>{isListening ? 'Stop' : 'Start'} Listen Mic</Button>
        <VolumeLevelBarWidget
          volumeLevel={capturedVolumeLevel}
          thresholdLevel={thresholdVolumeLevelNormalized}
        />
        {/* TODO: переименовать слайдер в "чувствительность" 0 - 100 для тупых */}
        <Button onClick={openModal}>Settings</Button>
        <AudioSettingsModal isModalOpened={isModalOpened} onOk={closeModal} onCancel={closeModal} />
      </div>
    </div>
  );
};
