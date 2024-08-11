import { useTranslation } from 'react-i18next';
import { Tag, Tooltip } from 'antd';

export const DontCloseTabBlock = () => {
  const { t } = useTranslation();

  return (
    <Tooltip
      className="cursor-pointer"
      title={t('VIDEO_DETECTOR_SETTINGS.DONT_CLOSE_THAT_TAB_TOOLTIP')}>
      <Tag color="blue" className="w-full whitespace-normal m-0 text-center ">
        {t('DONT_CLOSE_THAT_TAB', { ns: 'phrases' })}
      </Tag>
    </Tooltip>
  );
};
