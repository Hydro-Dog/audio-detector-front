import { theme } from 'antd';

export const useThemeToken = () => {
  const { useToken } = theme;
  const { token } = useToken();

  return token;
};
