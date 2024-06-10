import { useState } from 'react';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsInputCompositeOutlinedIcon from '@mui/icons-material/SettingsInputCompositeOutlined';
import { useSendAlertHook } from '@shared/hooks/index';
import { useThemeToken, DraggableModal, useMediaContext } from '@shared/index';
import { VideoComponent, VolumeLevelBarWidget } from '@widgets/index';
import { Button, Tooltip, Slider, SliderSingleProps } from 'antd';
import { useBoolean } from 'usehooks-ts';

export const MainPage = () => {
  const { value: isModalOpened, setTrue: openModal, setFalse: closeModal } = useBoolean(false);
  const { audioSettings, setAudioSettings } = useMediaContext();

  useSendAlertHook({
    currentVolumeLevel: audioSettings?.capturedVolumeLevel,
    thresholdVolumeLevel: audioSettings?.thresholdVolumeLevelNormalized,
    isListening: audioSettings?.isListening,
  });

  const { videoSettings, setVideoSettings } = useMediaContext();

  const token = useThemeToken();
  const [open, setOpen] = useState(false);
  const sensitivityMarks: SliderSingleProps['marks'] = {
    0: '0',
    10: {
      style: { color: token.colorError },
      label: <strong>10</strong>,
    },
  };

  const thresholdMarks: SliderSingleProps['marks'] = {
    0: '0',
    100: {
      style: { color: token.colorError },
      label: <strong>100</strong>,
    },
  };

  return (
    <div className="flex w-full h-screen">
      <div className="m-auto flex flex-row-reverse gap-3">
        {/* <Button
          onClick={() =>
            setAudioSettings((prev) => ({ ...prev, isListening: !audioSettings?.isListening }))
          }>
          {audioSettings?.isListening ? 'Stop' : 'Start'} Listen Mic
        </Button> */}

        <div className="flex flex-col gap-2 h-auto">
          <Tooltip title="Audio settings">
            <Button icon={<SettingsIcon />} onClick={() => setOpen(true)} />
          </Tooltip>

          <VolumeLevelBarWidget
            volumeLevel={audioSettings?.capturedVolumeLevel}
            thresholdLevel={audioSettings?.thresholdVolumeLevelNormalized}
            showArrow={open}
          />
        </div>
        {/* <AudioSettings /> */}

        <div className="flex flex-col gap-2 h-auto">
          <Tooltip title="Video settings">
            <Button icon={<SettingsIcon />} />
          </Tooltip>
          <VideoComponent {...videoSettings} />
        </div>

        <DraggableModal open={open} setOpen={setOpen}>
          <div className="flex">
            <div className="m-auto flex h-56 gap-4">
              <div className="flex flex-col gap-2 items-center">
                <CircleNotificationsOutlinedIcon />
                {/* TODO: переименовать слайдер в "чувствительность" 0 - 100 для тупых */}
                <Slider
                  vertical
                  marks={thresholdMarks}
                  value={audioSettings?.thresholdVolumeLevelNormalized}
                  onChange={(val) =>
                    setAudioSettings((prev) => ({ ...prev, thresholdVolumeLevelNormalized: val }))
                  }
                  max={100}
                  min={0}
                  step={1}
                />
              </div>

              <div className="flex flex-col gap-2 items-center">
                <SettingsInputCompositeOutlinedIcon />
                <Slider
                  vertical
                  marks={sensitivityMarks}
                  value={audioSettings?.sensitivityCoefficient}
                  onChange={(val) =>
                    setAudioSettings((prev) => ({ ...prev, sensitivityCoefficient: val }))
                  }
                  max={10}
                  min={0}
                  step={0.2}
                />
              </div>
            </div>
          </div>
        </DraggableModal>
        {/* <VideoSettings {...videoSettings} setVideoSettings={setVideoSettings} /> */}

        {/* <AudioSettingsModal isModalOpened={isModalOpened} onOk={closeModal} onCancel={closeModal} /> */}
      </div>
    </div>
  );
};
