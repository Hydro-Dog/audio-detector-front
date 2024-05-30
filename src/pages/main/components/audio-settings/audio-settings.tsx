import { useMediaContext } from '@shared/index';
import { createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import SettingsInputCompositeOutlinedIcon from '@mui/icons-material/SettingsInputCompositeOutlined';
import { AppDispatch, RootState, updateSettings } from '@store/index';
import { VolumeLevelBarWidget } from '@widgets/index';
import { Button, Modal, Slider, SliderSingleProps, notification } from 'antd';
import { theme as antdTheme } from 'antd';

export const AudioSettings = () => {
    const { useToken } = antdTheme;
    const { token } = useToken();
  const dispatch = useDispatch<AppDispatch>();
  const {
    capturedVolumeLevel,
    maxCapturedVolumeLevel,
    sensitivityCoefficient,
    setSensitivityCoefficient,
    thresholdVolumeLevelNormalized,
    setThresholdVolumeLevelNormalized,
  } = useMediaContext();

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
          thresholdVolumeLevelNormalized,
          micSensitivityCoefficient: sensitivityCoefficient,
        }),
      ).unwrap(); // Unwrap to handle success/failure
    } catch (error) {}
  };

  const onCancelClicked = () => {};

  return (
    <div className=' flex h-56 gap-4'>
      <div className="flex flex-col gap-2 items-center">
        <CircleNotificationsOutlinedIcon />
        {/* TODO: переименовать слайдер в "чувствительность" 0 - 100 для тупых */}
        <Slider
          vertical
          marks={thresholdMarks}
          value={thresholdVolumeLevelNormalized}
          onChange={setThresholdVolumeLevelNormalized}
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
          value={sensitivityCoefficient}
          onChange={setSensitivityCoefficient}
          max={10}
          min={0}
          step={0.2}
        />
      </div>
    </div>
  );
};
