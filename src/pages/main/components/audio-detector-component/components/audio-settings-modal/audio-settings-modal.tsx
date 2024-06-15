import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import SettingsInputCompositeOutlinedIcon from '@mui/icons-material/SettingsInputCompositeOutlined';
import { DraggableModal, useMediaContext, useThemeToken } from '@shared/index';
import { Slider, SliderSingleProps } from 'antd';

type Props = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
};

export const AudioSettingsModal = ({ open, onOk, onCancel }: Props) => {
  const token = useThemeToken();
  const { audioSettings, setAudioSettings } = useMediaContext();

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
    <DraggableModal open={open} onOk={onOk} onCancel={onCancel}>
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
  );
};
