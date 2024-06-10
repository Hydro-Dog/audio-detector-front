import { Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import { VideoSettingsType } from '@shared/context/index';
import { useThemeToken } from '@shared/index';
import { AppDispatch } from '@store/index';
import { Slider, SliderSingleProps, Tooltip } from 'antd';

type Props = VideoSettingsType & { setVideoSettings: Dispatch<SetStateAction<VideoSettingsType>> };

export const VideoSettings = ({
  range,
  innerWidth,
  height,
  interval,
  motionCoefficient,
  setVideoSettings,
}: Props) => {
  const token = useThemeToken();
  const dispatch = useDispatch<AppDispatch>();

  

  const rangeMarks: SliderSingleProps['marks'] = {
    80: '80',
    180: {
      style: { color: token.colorError },
      label: <strong>180</strong>,
    },
  };

  const intercalMarks: SliderSingleProps['marks'] = {
    30: '30',
    300: {
      style: { color: token.colorError },
      label: <strong>300</strong>,
    },
  };

  const motionCoefficientMarks: SliderSingleProps['marks'] = {
    0.005: '0.5%',
    2: {
      style: { color: token.colorError },
      label: <strong>2%</strong>,
    },
  };

  const onSaveClicked = async () => {
    try {
      // await dispatch(
      //   updateSettings({
      //     thresholdVolumeLevelNormalized,
      //     micSensitivityCoefficient: sensitivityCoefficient,
      //   }),
      // ).unwrap(); // Unwrap to handle success/failure
    } catch (error) {}
  };

  const onCancelClicked = () => {};

  return (
    <div className=" flex h-56 gap-4">
      <div className="flex flex-col gap-2 items-center">
        <Tooltip title="Range">
          <CircleNotificationsOutlinedIcon />
        </Tooltip>

        <Slider
          range
          vertical
          marks={rangeMarks}
          max={180}
          min={80}
          value={[range?.min, range?.max]}
          onChange={(val) => {
            setVideoSettings((prev) => ({ ...prev, range: { min: val[0], max: val[1] } }));
          }}
        />
      </div>

      <div className="flex flex-col gap-2 items-center">
        <Tooltip title="Interval">
          <CircleNotificationsOutlinedIcon />
        </Tooltip>
        <Slider
          vertical
          marks={intercalMarks}
          value={interval}
          onChange={(val) => {
            setVideoSettings((prev) => ({ ...prev, interval: val }));
          }}
          max={300}
          min={30}
          step={1}
        />
      </div>

      <div className="flex flex-col gap-2 items-center">
        <Tooltip title="Interval">
          <CircleNotificationsOutlinedIcon />
        </Tooltip>
        <Slider
          vertical
          marks={motionCoefficientMarks}
          value={motionCoefficient}
          onChange={(val) => {
            setVideoSettings((prev) => ({ ...prev, motionCoefficient: val }));
          }}
          max={2}
          min={0}
          step={0.005}
        />
      </div>
    </div>
  );
};
