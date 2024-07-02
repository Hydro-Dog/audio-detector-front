import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import { useMediaSettingsContext } from '@shared/index';
import { AppDispatch, RootState, fetchVideoSettings, updateVideoSettings } from '@store/index';
import { FETCH_STATUS } from '@store/types/fetch-status';
import { VideoDetectorWidget } from '@widgets/video-detector';
import { Tooltip, Button } from 'antd';
import { useBoolean } from 'usehooks-ts';
import { VideoSettingsModal } from './components';

type Props = {
  onAlert: () => void;
};

export const VideoDetectorComponent = ({ onAlert }: Props) => {
  const { t } = useTranslation();
  const {
    value: videoSettingsOpened,
    setTrue: setVideoSettingsOpened,
    setFalse: setVideoSettingsClosed,
  } = useBoolean();
  const dispatch = useDispatch<AppDispatch>();
  const { videoSettings, setVideoSettings } = useMediaSettingsContext();
  console.log('VideoDetectorComponent: ')
  const {
    fetchVideoSettingsStatus,
    updateVideoSettingsStatus,
    videoSettings: storedVideoSettings,
  } = useSelector((state: RootState) => state.videoSettings);

  useEffect(() => {
    dispatch(fetchVideoSettings());
  }, [dispatch]);

  useEffect(() => {
    setVideoSettings({ ...videoSettings, ...storedVideoSettings });
  }, [storedVideoSettings, setVideoSettings]);

  const onOk = () => {
    setVideoSettingsClosed();
    dispatch(updateVideoSettings(videoSettings!));
  };

  const onCancel = () => {
    setVideoSettingsClosed();
    dispatch(fetchVideoSettings());
  };

  return (
    <>
      <div className="flex flex-col gap-2 h-auto">
        {/* @ts-ignore */}
        <VideoDetectorWidget onAlert={onAlert} {...videoSettings} />
        <Tooltip title={t('VIDEO_DETECTOR_COMPONENT.CAMERA_SETTINGS_TOOLTIP')}>
          <Button
            icon={<SettingsIcon />}
            onClick={() => setVideoSettingsOpened()}
            loading={
              fetchVideoSettingsStatus === FETCH_STATUS.LOADING ||
              updateVideoSettingsStatus === FETCH_STATUS.LOADING
            }
          />
        </Tooltip>
      </div>
      <VideoSettingsModal open={videoSettingsOpened} onOk={onOk} onCancel={onCancel} />
    </>
  );
};
