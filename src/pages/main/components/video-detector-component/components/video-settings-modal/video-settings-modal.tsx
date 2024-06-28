import { useTranslation } from 'react-i18next';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { CursorEyeFollower, DraggableModal, useMediaContext } from '@shared/index';
import { Slider, SliderSingleProps, Tooltip } from 'antd';
import { Typography } from 'antd';
import { rangeFormatter } from './utils/range-formatter';

const { Text } = Typography;

const Title = () => {
  const { t } = useTranslation();

  return (
    <div className="relative flex gap-1">
      {t('VIDEO_DETECTOR_SETTINGS_MODAL.TITLE')}
      <CursorEyeFollower />
    </div>
  );
};

type Props = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
};

export const VideoSettingsModal = ({ open, onOk, onCancel }: Props) => {
  const { t } = useTranslation();
  const { videoSettings, setVideoSettings } = useMediaContext();

  const sensitivityMarks: SliderSingleProps['marks'] = {
    0.01: {
      label: (
        <Tooltip title={t('VIDEO_SETTINGS_MODAL.SENSITIVITY_HIGH_TOOLTIP')}>
          {t('HIGH', { ns: 'phrases' })}
        </Tooltip>
      ),
    },
    0.11: {
      label: (
        <Tooltip title={t('VIDEO_SETTINGS_MODAL.SENSITIVITY_MID_TOOLTIP')}>
          {t('MID', { ns: 'phrases' })}
        </Tooltip>
      ),
    },
    0.2: {
      label: (
        <Tooltip title={t('VIDEO_SETTINGS_MODAL.SENSITIVITY_LOW_TOOLTIP')}>
          {t('LOW', { ns: 'phrases' })}
        </Tooltip>
      ),
    },
  };

  return (
    <DraggableModal title={<Title />} width={320} open={open} onOk={onOk} onCancel={onCancel}>
      <div className="flex h-auto">
        <div className="m-auto flex h-56 h-auto gap-4">
          <div className="flex flex-col gap-2 items-center">
            <div className="flex items-center">
              <Text strong className="text-center">
                {t('VIDEO_DETECTOR_SETTINGS_MODAL.SENSITIVITY')}
              </Text>
              <Tooltip title={t('VIDEO_DETECTOR_SETTINGS_MODAL.SENSITIVITY_TOOLTIP')}>
                <HelpOutlineIcon className="!h-4" />
              </Tooltip>
            </div>

            <Slider
              vertical
              reverse
              marks={sensitivityMarks}
              value={videoSettings?.motionCoefficient}
              onChange={(val) => setVideoSettings((prev) => ({ ...prev, motionCoefficient: val }))}
              max={0.2}
              min={0.01}
              step={0.002}
              trackStyle={{ backgroundColor: 'transparent', height: 8 }}
              tooltip={{ formatter: rangeFormatter }}
              className="mb-4 shrink-0 h-40"
            />
          </div>
        </div>
      </div>
    </DraggableModal>
  );
};
