import { useTranslation } from 'react-i18next';
import { Typography, Tag } from 'antd';
import dayjs from 'dayjs';

const { Text } = Typography;

type Props = {
  timeLeft?: string;
};

export const TimeLeftBlock = ({ timeLeft }: Props) => {
  const { t } = useTranslation();
  // @ts-ignore
  const startTime = JSON.parse(localStorage.getItem('startOptions'))?.startTime;

  return (
    <div className="flex gap-2 w-full flex-col items-center">
      <Tag className="w-full m-0 text-center">
        <div>
          <Text type="secondary">{t('LAUNCH', { ns: 'phrases' })}: </Text>
          {dayjs(new Date(startTime)).format('DD MMMM YYYY, HH:mm:ss')}
        </div>
        <div>
          <Text type="secondary">{t('AFTER', { ns: 'phrases' })}: </Text>
          {timeLeft}
        </div>
      </Tag>
    </div>
  );
};
