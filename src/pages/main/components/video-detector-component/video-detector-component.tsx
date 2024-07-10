import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAudioSettingsContext, useVideoSettingsContext } from '@shared/index';
import { AppDispatch, RootState, fetchVideoSettings, updateVideoSettings } from '@store/index';
import { FETCH_STATUS } from '@store/types/fetch-status';
import { VideoDetectorWidget } from '@widgets/video-detector';
import { Tooltip, Button } from 'antd';
import { useBoolean, useWindowSize } from 'usehooks-ts';
import { VideoSettingsModal } from './components';
import classNames from 'classnames';
import { SCREEN_SIZE } from '@shared/enum/screen-size';

type Props = {
  onAlert: () => void;
};

export const VideoDetectorComponent = ({ onAlert }: Props) => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const {
    value: videoSettingsOpened,
    setTrue: setVideoSettingsOpened,
    setFalse: setVideoSettingsClosed,
  } = useBoolean();
  const dispatch = useDispatch<AppDispatch>();
  const { videoSettings, setVideoSettings } = useVideoSettingsContext();
  console.log('VideoDetectorComponent: ');
  const {
    fetchVideoSettingsStatus,
    updateVideoSettingsStatus,
    videoSettings: storedVideoSettings,
  } = useSelector((state: RootState) => state.videoSettings);

  useEffect(() => {
    dispatch(fetchVideoSettings());
  }, [dispatch]);

  const onOk = () => {
    setVideoSettingsClosed();
    dispatch(updateVideoSettings(videoSettings!));
  };

  const onCancel = () => {
    setVideoSettingsClosed();
    dispatch(fetchVideoSettings());
  };


  const wrapperClasses = classNames(
    'flex flex-col gap-2 h-auto',
    width > SCREEN_SIZE.MD ? 'items-start' : 'items-end',
  );

  return (
    <>
      <div className={wrapperClasses}>
        {/* @ts-ignore */}

        <VideoDetectorWidget
          onAlert={onAlert}
          motionCoefficient={videoSettings.motionCoefficient}
        />
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
