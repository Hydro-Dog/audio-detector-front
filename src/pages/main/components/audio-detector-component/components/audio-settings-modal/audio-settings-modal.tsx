import { useTranslation } from 'react-i18next';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DraggableModal, useMediaSettingsContext } from '@shared/index';
import { Slider, SliderSingleProps, Tooltip } from 'antd';
import { Typography } from 'antd';
import { formatterSensitivity } from './utils/formatter-sensitivity';

const { Text } = Typography;

type Props = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
};

export const AudioSettingsModal = ({ open, onOk, onCancel }: Props) => {
  const { t } = useTranslation();
  const { audioSettings, setAudioSettings } = useMediaSettingsContext();

  const sensitivityMarks: SliderSingleProps['marks'] = {
    0: {
      label: (
        <Tooltip title={t('AUDIO_SETTINGS_MODAL.SENSITIVITY_LOW_TOOLTIP')}>
          {t('LOW', { ns: 'phrases' })}
        </Tooltip>
      ),
    },
    5: {
      label: (
        <Tooltip title={t('AUDIO_SETTINGS_MODAL.SENSITIVITY_MID_TOOLTIP')}>
          {t('MID', { ns: 'phrases' })}
        </Tooltip>
      ),
    },
    10: {
      label: (
        <Tooltip title={t('AUDIO_SETTINGS_MODAL.SENSITIVITY_HIGH_TOOLTIP')}>
          {t('HIGH', { ns: 'phrases' })}
        </Tooltip>
      ),
    },
  };

  const thresholdMarks: SliderSingleProps['marks'] = {
    0: {
      label: (
        <Tooltip title={t('AUDIO_SETTINGS_MODAL.THRESHOLD_LOW_TOOLTIP')}>
          {t('LOW_M', { ns: 'phrases' })}
        </Tooltip>
      ),
    },
    50: {
      label: (
        <Tooltip title={t('AUDIO_SETTINGS_MODAL.THRESHOLD_MID_TOOLTIP')}>
          {t('MID_M', { ns: 'phrases' })}
        </Tooltip>
      ),
    },
    100: {
      label: (
        <Tooltip title={t('AUDIO_SETTINGS_MODAL.THRESHOLD_HIGH_TOOLTIP')}>
          {t('HIGH_M', { ns: 'phrases' })}
        </Tooltip>
      ),
    },
  };

  return (
    <DraggableModal
      title={t('AUDIO_DETECTOR_SETTINGS_MODAL.TITLE')}
      width={420}
      open={open}
      onOk={onOk}
      onCancel={onCancel}>
      <div className="flex h-auto">
        <div className="m-auto flex h-56 h-auto gap-4 w-full">
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-2 items-center">
              <div className="flex items-center">
                <Text strong className="text-center">
                  {t('AUDIO_DETECTOR_SETTINGS_MODAL.SENSITIVITY')}
                </Text>
                <Tooltip title={t('AUDIO_DETECTOR_SETTINGS_MODAL.SENSITIVITY_TOOLTIP')}>
                  <HelpOutlineIcon className="!h-4" />
                </Tooltip>
              </div>
              <Slider
                vertical
                marks={sensitivityMarks}
                value={audioSettings?.sensitivityCoefficient}
                onChange={(val) =>
                  setAudioSettings((prev) => ({ ...prev, sensitivityCoefficient: val }))
                }
                max={10}
                min={0}
                step={0.2}
                trackStyle={{ backgroundColor: 'transparent', height: 8 }}
                tooltip={{ formatter: formatterSensitivity }}
                className="mb-4 shrink-0 h-40"
              />
            </div>

            <div className="flex flex-col gap-2 items-center">
              <div className="flex items-center">
                <Text strong className="text-center">
                  {t('AUDIO_DETECTOR_SETTINGS_MODAL.THRESHOLD_LEVEL')}
                </Text>
                <Tooltip title={t('AUDIO_DETECTOR_SETTINGS_MODAL.THRESHOLD_TOOLTIP')}>
                  <HelpOutlineIcon className="!h-4" />
                </Tooltip>
              </div>
              <Slider
                vertical
                marks={thresholdMarks}
                value={audioSettings?.thresholdVolumeLevelNormalized}
                onChange={(val) =>
                  setAudioSettings((prev) => ({ ...prev, thresholdVolumeLevelNormalized: val }))
                }
                max={100}
                min={0}
                step={1}
                trackStyle={{ backgroundColor: 'transparent', height: 8 }}
                className="mb-4 shrink-0 h-40"
              />
            </div>
          </div>
        </div>
      </div>
    </DraggableModal>
  );
};
