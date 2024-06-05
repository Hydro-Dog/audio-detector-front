import { PropsWithChildren, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogoutOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { ROUTES } from '@shared/enum';
import { useNotificationContext, useTheme } from '@shared/index';
import { logoutUser, setLoginStatus, setLogoutStatus } from '@store/slices';
import { AppDispatch, RootState } from '@store/store';
import { Button, Layout, Menu } from 'antd';

const { Footer, Sider } = Layout;
const { Item } = Menu;

export const MainMenuWidget = ({ children }: PropsWithChildren<Record<never, any>>) => {
  const dispatch = useDispatch<AppDispatch>();
  const { logoutStatus, loginError } = useSelector((state: RootState) => state.user);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<ROUTES[]>([]);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { openNotification } = useNotificationContext();

  //TODO: вынести в хук useGetCurrentRoot
  const getFirstPathSegment = (pathname: string): ROUTES => {
    const segments = pathname.split('/').filter(Boolean);
    return (segments.length ? segments[0] : '') as ROUTES;
  };

  const onMenuItemClick = (path: string) => {
    navigate(path);
  };

  const onLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (logoutStatus === 'error') {
      openNotification({ type: 'error', message: 'Ошибка', description: 'Неудачный логаут' });
    } else if (logoutStatus === 'success') {
      navigate(ROUTES.SIGN_IN);
      dispatch(setLogoutStatus('idle'));
    }
  }, [dispatch, logoutStatus, navigate, openNotification]);

  useEffect(() => {
    setSelectedMenuKeys([getFirstPathSegment(location.pathname)]);
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme={theme}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu selectedKeys={selectedMenuKeys} mode="inline">
          <Item
            key={ROUTES.PROFILE}
            icon={<UserOutlined />}
            onClick={() => onMenuItemClick(ROUTES.PROFILE)}>
            Профиль
          </Item>
          <Item
            key={ROUTES.ROOT}
            icon={<VideoCameraOutlined />}
            onClick={() => onMenuItemClick(ROUTES.ROOT)}>
            Мониторинг
          </Item>

          <Button
            type="text"
            block
            onClick={onLogout}
            loading={logoutStatus === 'loading'}
            icon={<LogoutOutlined />}>
            Выход
          </Button>
        </Menu>
        <Footer style={{ textAlign: 'center' }}>
          <p>AudioCore</p>
          <p>©2024</p>
          <p>Created by hydrodog & lechiffre</p>
        </Footer>
      </Sider>
      <Layout>{children}</Layout>
    </Layout>
  );
};
