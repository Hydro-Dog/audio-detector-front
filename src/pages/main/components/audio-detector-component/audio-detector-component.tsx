import { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { useMediaContext } from '@shared/index';
import { VolumeLevelBarWidget } from '@widgets/index';
import { Button, Tooltip } from 'antd';
import { AudioSettingsModal } from './components/audio-settings-modal';
import { fetchAudioSettings, updateAudioSettings } from '@store/slices/audio-slice';
import { AppDispatch, RootState } from '@store/store';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'usehooks-ts';
import { FETCH_STATUS } from '@store/types/fetch-status';

export const AudioDetectorComponent = () => {
  const {
    value: audioSettingsOpened,
    setTrue: setAudioSettingsOpened,
    setFalse: setAudioSettingsClosed,
  } = useBoolean();
  const dispatch = useDispatch<AppDispatch>();
  const { audioSettings, setAudioSettings } = useMediaContext();
  const { fetchAudioSettingsStatus, updateAudioSettingsStatus } = useSelector(
    (state: RootState) => state.videoSettings,
  );

  useEffect(() => {
    dispatch(fetchAudioSettings());
  }, [dispatch]);

  const onOk = () => {
    setAudioSettingsClosed();
    dispatch(updateAudioSettings(audioSettings!));
  };

  const onCancel = () => {
    setAudioSettingsClosed();
    dispatch(fetchAudioSettings());
  };

  return (
    <>
      <div className="flex flex-col gap-2 h-auto">
        <VolumeLevelBarWidget
          volumeLevel={audioSettings?.capturedVolumeLevel}
          thresholdLevel={audioSettings?.thresholdVolumeLevelNormalized}
          showArrow={audioSettingsOpened}
        />
        <Tooltip title="Audio settings">
          <Button
            icon={<SettingsIcon />}
            onClick={setAudioSettingsOpened}
            loading={
              fetchAudioSettingsStatus === FETCH_STATUS.LOADING ||
              updateAudioSettingsStatus === FETCH_STATUS.LOADING
            }
          />
        </Tooltip>
      </div>
      <AudioSettingsModal open={audioSettingsOpened} onOk={onOk} onCancel={onCancel} />
    </>
  );
};
