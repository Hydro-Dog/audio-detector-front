import { useState, useEffect } from 'react';
import { DETECTION_SOURCE } from '@shared/index';
import { Button, Typography, Tag, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useBoolean } from 'usehooks-ts';
import { DetectSettingsModal } from './components';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

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
