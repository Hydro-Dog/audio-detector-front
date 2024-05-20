import { useCallback } from 'react';
import { useAudioContext } from '@shared/index';
import { VolumeLevelBarWidget } from '@widgets/index';
import { Button } from 'antd';
import { useBoolean } from 'usehooks-ts';
import { AudioSettingsModal } from './audio-settings-modal';

export const MainPage = () => {
  const { value: isModalOpened, setTrue: openModal, setFalse: closeModal } = useBoolean(false);
  const { capturedVolumeLevel, isMicOn, setMicOn, setMicOff } = useAudioContext();

  const onTunOn = useCallback(
    () => (isMicOn ? setMicOff() : setMicOn()),
    [isMicOn, setMicOff, setMicOn],
  );

  return (
    <div className="flex w-full h-screen">
      <div className="m-auto w-fit">
        <Button onClick={onTunOn}>{isMicOn ? 'Off' : 'On'}</Button>
        <div>Alert: {capturedVolumeLevel}</div>
        <VolumeLevelBarWidget volumeLevel={capturedVolumeLevel} />
        {/* TODO: переименовать слайдер в "чувствительность" 0 - 100 для тупых */}
        <Button onClick={openModal}>Settings</Button>
        <AudioSettingsModal isModalOpened={isModalOpened} onOk={closeModal} onCancel={closeModal} />
      </div>
    </div>
  );
};
