import { createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import SettingsInputCompositeOutlinedIcon from '@mui/icons-material/SettingsInputCompositeOutlined';
import { useMediaContext } from '@shared/index';
import { AppDispatch, updateSettings, RootState } from '@store/index';
import { VolumeLevelBarWidget } from '@widgets/index';
import { Button, Modal, Slider, SliderSingleProps, notification } from 'antd';
import { theme as antdTheme } from 'antd';

const Context = createContext({ name: 'Default' });

type Props = {
  isModalOpened: boolean;
  onOk: () => void;
  onCancel: () => void;
};

export const AudioSettingsModal = ({ isModalOpened, onOk, onCancel }: Props) => {
  const { useToken } = antdTheme;
  const { token } = useToken();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message: string) => {
    api.error({
      message: `Warning`,
      description: <Context.Consumer>{({ name }) => message}</Context.Consumer>,
      placement: 'bottomRight',
    });
  };

  const dispatch = useDispatch<AppDispatch>();
  const { settings, settingsError, settingsIsLoading } = useSelector(
    (state: RootState) => state.settings,
  );

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
      onOk();
    } catch (error) {
      openNotification('Unable to update settings, please try again.');
    }
  };

  const onCancelClicked = () => {
    if (!settings) {
      openNotification('Unable to reset your settings, pleaser reload the page');
    } else {
      setThresholdVolumeLevelNormalized(settings.thresholdVolumeLevelNormalized);
      setSensitivityCoefficient(settings.micSensitivityCoefficient);
      onCancel();
    }
  };

  return (
    <Context.Provider value={{ name: 'snackbar_context' }}>
      <Modal
        title="Settings"
        open={isModalOpened}
        footer={[
          <Button key="back" onClick={onCancelClicked} loading={settingsIsLoading}>
            Отмена
          </Button>,
          <Button key="submit" type="primary" onClick={onSaveClicked} loading={settingsIsLoading}>
            Сохранить
          </Button>,
        ]}
        onCancel={onCancel}>
        <div className="flex">
          <div className="m-auto flex h-56 gap-4">
            <VolumeLevelBarWidget
              volumeLevel={capturedVolumeLevel}
              thresholdLevel={thresholdVolumeLevelNormalized}
            />
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
        </div>
        <div>MAX: {maxCapturedVolumeLevel}</div>
        <div>CURRENT: {capturedVolumeLevel}</div>
        <div>sensitivityCoefficient: {sensitivityCoefficient}</div>
      </Modal>
      {contextHolder}
    </Context.Provider>
  );
};
