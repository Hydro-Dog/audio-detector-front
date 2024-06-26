import { useTranslation } from 'react-i18next';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { CursorEyeFollower, DraggableModal, useMediaContext, useThemeToken } from '@shared/index';
import { Slider, SliderSingleProps, Tooltip } from 'antd';
import { Typography } from 'antd';

const { Text } = Typography;

const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value?: number) =>
  `${100 - value! * 500 + 5}%`;

const Title = () => {
  const { t } = useTranslation();

  return (
    <div className='relative flex gap-1'>
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
  const token = useThemeToken();
  const { t } = useTranslation();
  const { videoSettings, setVideoSettings } = useMediaContext();

  const sensitivityMarks: SliderSingleProps['marks'] = {
    0.01: 'Высокая',
    0.1: 'Средняя',
    0.2: 'Низкая',
  };

  console.log('log')

  return (
    <DraggableModal title={<Title />} width={320} open={open} onOk={onOk} onCancel={onCancel}>
      <div className="flex h-auto">
        {/* <CursorEyeFollower /> */}
        <div className="m-auto flex h-56 h-auto gap-4">
          <div className="flex flex-col gap-2 items-center">
            <Text>{t('VIDEO_DETECTOR_SETTINGS_MODAL.SENSITIVITY')}</Text>
            <Slider
              vertical
              reverse
              marks={sensitivityMarks}
              value={videoSettings?.motionCoefficient}
              onChange={(val) => setVideoSettings((prev) => ({ ...prev, motionCoefficient: val }))}
              max={0.2}
              min={0.01}
              step={0.01}
              trackStyle={{ backgroundColor: 'transparent', height: 8 }}
              tooltip={{ formatter }}
              className="mb-4 shrink-0 h-40"
            />

            <div className="flex gap-1">
              <Tooltip title={t('VIDEO_DETECTOR_SETTINGS_MODAL.SENSITIVITY_TOOLTIP')}>
                <HelpOutlineIcon />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </DraggableModal>
  );
};
