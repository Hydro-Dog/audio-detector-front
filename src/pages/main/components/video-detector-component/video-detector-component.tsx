import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import { useMediaContext } from '@shared/index';
import { AppDispatch, fetchVideoSettings, updateVideoSettings } from '@store/index';
import { VideoDetectorWidget } from '@widgets/video-detector';
import { Tooltip, Button } from 'antd';
import { VideoSettingsModal } from './components';
import { useBoolean } from 'usehooks-ts';

export const VideoDetectorComponent = () => {
  const {
    value: videoSettingsOpened,
    setTrue: setVideoSettingsOpened,
    setFalse: setVideoSettingsClosed,
  } = useBoolean();
  const dispatch = useDispatch<AppDispatch>();
  const { videoSettings, setVideoSettings } = useMediaContext();

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
        <Tooltip title="Video settings">
          <Button icon={<SettingsIcon />} onClick={() => setVideoSettingsOpened()} />
        </Tooltip>
        <VideoDetectorWidget {...videoSettings} />
      </div>
      <VideoSettingsModal open={videoSettingsOpened} onOk={onOk} onCancel={onCancel} />
    </>
  );
};
