import { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';

type Props = {
  style?: CSSProperties;
};

export const BackButton = ({ style }: Props) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Вернуться на один шаг назад в истории браузера
  };

  return (
    <Button onClick={goBack} icon={<LeftOutlined />} style={{ width: 'fit-content', ...style }}>
      {/* TODO: перевод */}
      Назад
    </Button>
  );
};
