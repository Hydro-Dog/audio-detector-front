import { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { useThemeToken, useMediaContext } from '@shared/index';
import { VideoDetectorWidget, VolumeLevelBarWidget } from '@widgets/index';
import { Button, Tooltip } from 'antd';
import { AudioSettingsModal } from './components';
import { VideoDetectorComponent } from './components/video-detector-component';

export const MainPage = () => {
  const [audioSettingsOpened, setAudioSettingsOpened] = useState(false);
  const { audioSettings, videoSettings } = useMediaContext();

  return (
    <div className="flex w-full h-screen">
      <div className="m-auto flex flex-row-reverse gap-3">
        <div className="flex flex-col gap-2 h-auto">
          <Tooltip title="Audio settings">
            <Button icon={<SettingsIcon />} onClick={() => setAudioSettingsOpened(true)} />
          </Tooltip>

          <VolumeLevelBarWidget
            volumeLevel={audioSettings?.capturedVolumeLevel}
            thresholdLevel={audioSettings?.thresholdVolumeLevelNormalized}
            showArrow={audioSettingsOpened}
          />
        </div>

        <VideoDetectorComponent />
        <AudioSettingsModal open={audioSettingsOpened} setOpen={setAudioSettingsOpened} />
      </div>
    </div>
  );
};
