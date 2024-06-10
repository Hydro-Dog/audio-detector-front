import { useDispatch } from 'react-redux';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import SettingsInputCompositeOutlinedIcon from '@mui/icons-material/SettingsInputCompositeOutlined';
import { useMediaContext, useThemeToken } from '@shared/index';
import { AppDispatch, updateSettings } from '@store/index';
import { Slider, SliderSingleProps } from 'antd';
import { theme as antdTheme } from 'antd';

export const AudioSettings = () => {
  const token = useThemeToken();
  const dispatch = useDispatch<AppDispatch>();
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

  const onSaveClicked = async () => {
    try {
      await dispatch(
        updateSettings({
          thresholdVolumeLevelNormalized: audioSettings!.thresholdVolumeLevelNormalized,
          micSensitivityCoefficient: audioSettings!.sensitivityCoefficient,
        }),
      ).unwrap(); // Unwrap to handle success/failure
    } catch (error) {}
  };

  const onCancelClicked = () => {};

  return (
    <div className=" flex h-56 gap-4">
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
          onChange={(val) => setAudioSettings((prev) => ({ ...prev, sensitivityCoefficient: val }))}
          max={10}
          min={0}
          step={0.2}
        />
      </div>
    </div>
  );
};
