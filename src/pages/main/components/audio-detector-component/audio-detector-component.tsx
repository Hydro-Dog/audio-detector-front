import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import { useMediaContext } from '@shared/index';
import { fetchAudioSettings, updateAudioSettings } from '@store/slices/audio-slice';
import { AppDispatch, RootState } from '@store/store';
import { FETCH_STATUS } from '@store/types/fetch-status';
import { VolumeLevelBarWidget } from '@widgets/index';
import { Button, Tooltip } from 'antd';
import { useBoolean } from 'usehooks-ts';
import { AudioSettingsModal } from './components/audio-settings-modal';

export const AudioDetectorComponent = () => {
  const { t } = useTranslation();
  const {
    value: audioSettingsOpened,
    setTrue: setAudioSettingsOpened,
    setFalse: setAudioSettingsClosed,
  } = useBoolean();
  const dispatch = useDispatch<AppDispatch>();
  const { audioSettings, setAudioSettings } = useMediaContext();
  const {
    fetchAudioSettingsStatus,
    updateAudioSettingsStatus,
    audioSettings: audioSettingsState,
  } = useSelector((state: RootState) => state.audioSettings);

  useEffect(() => {
    dispatch(fetchAudioSettings());
  }, [dispatch]);

  //   useEffect(() => {
  //     setAudioSettings({ ...audioSettingsState!, ...audioSettingsState });
  //   }, [audioSettingsState]);

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
      
      {/* {t('jopa', {ns: 'phrases'})} */}
      
        <VolumeLevelBarWidget
          volumeLevel={audioSettings?.capturedVolumeLevel}
          thresholdLevel={audioSettings?.thresholdVolumeLevelNormalized}
          showArrow={audioSettingsOpened}
        />
        <Tooltip title={t('AUDIO_DETECTOR_COMPONENT.MIC_SETTINGS_TOOLTIP')}>
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
