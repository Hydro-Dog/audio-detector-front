import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, theme as antdTheme } from 'antd';
import { useNavigate } from 'react-router-dom';

export const RegisterOk = () => {
  const { useToken } = antdTheme;
  const { token } = useToken();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center m-auto">
      <div className="flex flex-col items-center">
        <CheckCircleOutlined style={{ fontSize: '48px', color: token.colorPrimaryHover }} />
        <h1 className="text-lg font-semibold mt-2 text-gray-600">Регистрация прошла успешно</h1>
        <Button type="primary" className="mt-4" onClick={() => navigate('/')}>
          На главную
        </Button>
      </div>
    </div>
  );
};
