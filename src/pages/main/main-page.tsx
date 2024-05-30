import { useSendAlertHook } from '@shared/hooks/index';
import { useMediaContext } from '@shared/index';
import { VideoComponent, VolumeLevelBarWidget } from '@widgets/index';
import { Button } from 'antd';
import { useBoolean } from 'usehooks-ts';
import { AudioSettingsModal } from './audio-settings-modal';
import { AudioSettings, VideoSettings } from './components';

export const MainPage = () => {
  const { value: isModalOpened, setTrue: openModal, setFalse: closeModal } = useBoolean(false);
  const { capturedVolumeLevel, isListening, toggleIsListening, thresholdVolumeLevelNormalized } =
    useMediaContext();

  useSendAlertHook({
    currentVolumeLevel: capturedVolumeLevel,
    thresholdVolumeLevel: thresholdVolumeLevelNormalized,
    isListening,
  });

  const { videoSettings, setVideoSettings } = useMediaContext();

  return (
    <div className="flex w-full h-screen">
      <div className="m-auto w-fit">
        <Button onClick={toggleIsListening}>{isListening ? 'Stop' : 'Start'} Listen Mic</Button>
        <VolumeLevelBarWidget
          volumeLevel={capturedVolumeLevel}
          thresholdLevel={thresholdVolumeLevelNormalized}
        />
        <AudioSettings />
        <div className='h-56'></div>
        <VideoComponent {...videoSettings} />
        <VideoSettings {...videoSettings} setVideoSettings={setVideoSettings}/>

        <AudioSettingsModal isModalOpened={isModalOpened} onOk={closeModal} onCancel={closeModal} />
      </div>
    </div>
  );
};
