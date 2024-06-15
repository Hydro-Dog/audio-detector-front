import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import { useMediaContext } from '@shared/index';
import { AppDispatch, RootState, fetchVideoSettings, updateVideoSettings } from '@store/index';
import { VideoDetectorWidget } from '@widgets/video-detector';
import { Tooltip, Button } from 'antd';
import { VideoSettingsModal } from './components';
import { useBoolean } from 'usehooks-ts';
import { FETCH_STATUS } from '@store/types/fetch-status';

export const VideoDetectorComponent = () => {
  const {
    value: videoSettingsOpened,
    setTrue: setVideoSettingsOpened,
    setFalse: setVideoSettingsClosed,
  } = useBoolean();
  const dispatch = useDispatch<AppDispatch>();
  const { videoSettings, setVideoSettings } = useMediaContext();
  const { fetchVideoSettingsStatus, updateVideoSettingsStatus } = useSelector(
    (state: RootState) => state.videoSettings,
  );

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

  return (
    <>
      <div className="flex flex-col gap-2 h-auto">
        <VideoDetectorWidget {...videoSettings} />
        <Tooltip title="Video settings">
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
