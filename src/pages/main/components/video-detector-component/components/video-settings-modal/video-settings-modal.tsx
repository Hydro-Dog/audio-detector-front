import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import { DraggableModal, useMediaContext, useThemeToken } from '@shared/index';
import { Slider, SliderSingleProps } from 'antd';

type Props = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
};

export const VideoSettingsModal = ({ open, onOk, onCancel }: Props) => {
  const token = useThemeToken();
  const { videoSettings, setVideoSettings } = useMediaContext();

  const sensitivityMarks: SliderSingleProps['marks'] = {
    0: '0',
    10: {
      style: { color: token.colorError },
      label: <strong>10</strong>,
    },
  };

  const thresholdMarks: SliderSingleProps['marks'] = {
    0: '0',
    0.2: {
      style: { color: token.colorError },
      label: <strong>0.2</strong>,
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
              value={videoSettings?.motionCoefficient}
              onChange={(val) => setVideoSettings((prev) => ({ ...prev, motionCoefficient: val }))}
              max={0.2}
              min={0}
              step={0.01}
            />
          </div>
        </div>
      </div>
    </DraggableModal>
  );
};
