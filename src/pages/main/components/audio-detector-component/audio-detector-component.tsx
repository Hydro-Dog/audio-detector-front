import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import { SCREEN_SIZE } from '@shared/enum/screen-size';
import { useMediaContext, useAudioSettingsContext } from '@shared/index';
import { fetchAudioSettings, updateAudioSettings } from '@store/slices/audio-slice';
import { AppDispatch, RootState } from '@store/store';
import { FETCH_STATUS } from '@store/types/fetch-status';
import { VolumeLevelBarWidget } from '@widgets/index';
import { Button, Tooltip } from 'antd';
import { AudioLevelContext } from 'src/app/App';
import { getAudioContext } from 'src/app/utils';
import { useBoolean, useWindowSize } from 'usehooks-ts';
import { AudioSettingsModal } from './components/audio-settings-modal';
import { VolumeLevelBarVerticalWidget } from '@widgets/volume-level-bar/volume-level-bar-vertical';
import classNames from 'classnames';

const BYTE_FREQUENCY_DATA_MAX = 256;

type Props = {
  onAlert?: () => void;
};

export const AudioDetectorComponent = ({ onAlert }: Props) => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const {
    value: audioSettingsOpened,
    setTrue: setAudioSettingsOpened,
    setFalse: setAudioSettingsClosed,
  } = useBoolean();
  const dispatch = useDispatch<AppDispatch>();
  const { audioSettings, setAudioSettings } = useAudioSettingsContext();
  const [audioLevel, setAudioLevel] = useState(0);
  const { media } = useMediaContext();
  const { audioContext, analyser } = getAudioContext();
  const {
    fetchAudioSettingsStatus,
    updateAudioSettingsStatus,
    audioSettings: audioSettingsStored,
  } = useSelector((state: RootState) => state.audioSettings);

  useEffect(() => {
    dispatch(fetchAudioSettings());
  }, [dispatch]);

  // useEffect(() => {
  //   setAudioSettings({ ...audioSettings, ...audioSettingsStored });
  // }, [audioSettingsStored, setAudioSettings]);

  useEffect(() => {
    if (media?.stream && media?.microphoneSource && media?.scriptProcessor) {
      media.microphoneSource.connect(analyser);
      analyser.connect(media.scriptProcessor);
      media.scriptProcessor.connect(audioContext.destination);
      audioContext.resume();

      let lastUpdateTime = Date.now();

      media.scriptProcessor.onaudioprocess = function () {
        if (Date.now() - lastUpdateTime > 100) {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);

          const arraySum = array.reduce((a, value) => a + value, 0);
          const average = arraySum / array.length;
          const averageNormalized = Math.round(
            //@ts-ignore
            (average * 100 * audioSettings?.sensitivityCoefficient) / BYTE_FREQUENCY_DATA_MAX,
          );
          //TODO: вот этот setState дергает ререндер всех компонентов, где используется useMediaContext
          // setAudioSettings((prev) => ({
          //   ...prev,
          //   capturedVolumeLevel: averageNormalized > 100 ? 100 : averageNormalized,
          // }));
          setAudioLevel(averageNormalized > 100 ? 100 : averageNormalized);
          lastUpdateTime = Date.now();
        }
      };
    }

    return () => {
      if (media?.scriptProcessor) {
        media.scriptProcessor.onaudioprocess = null;
        analyser.disconnect();
        media?.microphoneSource?.disconnect();
      }
    };
  }, [
    analyser,
    audioContext,
    audioSettings?.sensitivityCoefficient,
    media?.microphoneSource,
    media?.scriptProcessor,
    media?.stream,
    setAudioLevel,
  ]);

  const onOk = () => {
    setAudioSettingsClosed();
    dispatch(updateAudioSettings(audioSettings!));
  };

  const onCancel = () => {
    setAudioSettingsClosed();
    dispatch(fetchAudioSettings());
  };

  const VolumeComponent = useMemo(
    () => (width > SCREEN_SIZE.MD ? VolumeLevelBarWidget : VolumeLevelBarVerticalWidget),
    [width],
  );

  const containerClasses = classNames(
    'flex gap-2 h-full',
    width > SCREEN_SIZE.MD ? 'flex-col' : 'flex-row-reverse',
  );

  return (
    <>
      <div className={containerClasses}>
        {/* {t('jopa', {ns: 'phrases'})} */}

        <VolumeComponent
          volumeLevel={audioLevel}
          thresholdLevel={audioSettings?.thresholdVolumeLevelNormalized}
          showArrow={audioSettingsOpened}
          onAlert={onAlert}
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
