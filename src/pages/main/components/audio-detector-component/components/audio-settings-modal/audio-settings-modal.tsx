import { useTranslation } from 'react-i18next';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DraggableModal, useMediaContext, useThemeToken } from '@shared/index';
import { Slider, SliderSingleProps, Tooltip } from 'antd';
import { Typography } from 'antd';

const { Text } = Typography;

const formatterSensitivity: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (
  value?: number,
) => `${value! * 10}`;

type Props = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
};

export const AudioSettingsModal = ({ open, onOk, onCancel }: Props) => {
  const token = useThemeToken();
  const { t } = useTranslation();
  const { audioSettings, setAudioSettings } = useMediaContext();

  console.log('useMediaContext 2 ')

  const sensitivityMarks: SliderSingleProps['marks'] = {
    0: 'Низкая',
    5: 'Средняя',
    10: 'Высокая',
  };

  const thresholdMarks: SliderSingleProps['marks'] = {
    0: 'Низкая',
    50: 'Средняя',
    100: 'Высокая',
  };

  return (
    <DraggableModal
      title={t('AUDIO_DETECTOR_SETTINGS_MODAL.TITLE')}
      width={420}
      open={open}
      onOk={onOk}
      onCancel={onCancel}>
      <div className="flex h-auto">
        <div className="m-auto flex h-56 h-auto gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 items-center">
              <Text className="text-center">{t('AUDIO_DETECTOR_SETTINGS_MODAL.SENSITIVITY')}</Text>
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

              <div className="max-w-40">
                <Tooltip title={t('AUDIO_DETECTOR_SETTINGS_MODAL.SENSITIVITY_TOOLTIP')}>
                  <HelpOutlineIcon />
                </Tooltip>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center">
              <Text className="text-center">
                {t('AUDIO_DETECTOR_SETTINGS_MODAL.THRESHOLD_LEVEL')}
              </Text>
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

              <div className="max-w-40">
                <Tooltip title={t('AUDIO_DETECTOR_SETTINGS_MODAL.THRESHOLD_TOOLTIP')}>
                  <HelpOutlineIcon />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DraggableModal>
  );
};
