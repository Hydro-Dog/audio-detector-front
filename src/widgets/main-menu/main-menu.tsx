import { PropsWithChildren, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogoutOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { ROUTES } from '@shared/enum';
import { useNotificationContext, useTheme } from '@shared/index';
import { logoutUser, setLogoutStatus } from '@store/slices';
import { AppDispatch, RootState } from '@store/store';
import { Button, Layout, Menu } from 'antd';

const { Footer, Sider } = Layout;

export const MainMenuWidget = ({ children }: PropsWithChildren<Record<never, any>>) => {
  const dispatch = useDispatch<AppDispatch>();
  const { logoutStatus } = useSelector((state: RootState) => state.user);
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

  const menuItems = [
    {
      key: ROUTES.PROFILE,
      icon: <UserOutlined />,
      label: 'Профиль',
      onClick: () => onMenuItemClick(ROUTES.PROFILE),
    },
    {
      key: ROUTES.ROOT,
      icon: <VideoCameraOutlined />,
      label: 'Мониторинг',
      onClick: () => onMenuItemClick(ROUTES.ROOT),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme={theme}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu selectedKeys={selectedMenuKeys} mode="inline" items={menuItems} />
        <Button
          type="text"
          block
          onClick={onLogout}
          loading={logoutStatus === 'loading'}
          icon={<LogoutOutlined />}>
          Выход
        </Button>
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
