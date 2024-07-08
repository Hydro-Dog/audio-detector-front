import { PropsWithChildren, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogoutOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { ROUTES } from '@shared/enum';
import { useNotificationContext, useTheme } from '@shared/index';
import { logoutUser, setLogoutStatus } from '@store/slices';
import { AppDispatch, RootState } from '@store/store';
import { Button, Layout, Menu, Tooltip, Typography } from 'antd';
import { FETCH_STATUS } from '@store/types/fetch-status';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useMediaQuery, useScreen, useWindowSize } from 'usehooks-ts';
import { SCREEN_SIZE } from '@shared/enum/screen-size';

const { Sider } = Layout;
const { Text } = Typography;

export const MainMenuWidget = ({ children }: PropsWithChildren<Record<never, any>>) => {
  const { width } = useWindowSize();

  const dispatch = useDispatch<AppDispatch>();
  const { logoutStatus } = useSelector((state: RootState) => state.user);
  const [collapsed, setCollapsed] = useState(width < SCREEN_SIZE.MD);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<ROUTES[]>([]);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { openNotification } = useNotificationContext();
  const { t } = useTranslation();

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
    if (logoutStatus === FETCH_STATUS.ERROR) {
      openNotification({ type: 'error', message: 'Ошибка', description: 'Неудачный логаут' });
    } else if (logoutStatus === FETCH_STATUS.SUCCESS) {
      navigate(ROUTES.SIGN_IN);
      dispatch(setLogoutStatus(FETCH_STATUS.IDLE));
    }
  }, [dispatch, logoutStatus, navigate, openNotification]);

  useEffect(() => {
    setSelectedMenuKeys([getFirstPathSegment(location.pathname)]);
  }, [location.pathname]);

  const menuItems = [
    // {
    //   key: ROUTES.PROFILE,
    //   icon: <UserOutlined />,
    //   label: t('PROFILE', { ns: 'phrases' }),
    //   onClick: () => onMenuItemClick(ROUTES.PROFILE),
    // },
    {
      key: '',
      icon: <VideoCameraOutlined />,
      label: t('MONITORING', { ns: 'phrases' }),
      onClick: () => onMenuItemClick(ROUTES.ROOT),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined rotate={180} />,
      label: t('EXIT', { ns: 'phrases' }),
      onClick: onLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme={theme}
        collapsible={width > SCREEN_SIZE.SM}
        collapsed={width > SCREEN_SIZE.SM ? collapsed : true}
        onCollapse={(value) => setCollapsed(value)}>
        <div className="flex flex-col justify-between h-full">
          <Menu
            // mode="horizontal"
            selectedKeys={selectedMenuKeys}
            mode="inline"
            items={menuItems}
          />

          {!collapsed && (
            <Tooltip title={t('COPYRIGHT', { ns: 'phrases' })}>
              <Text type="secondary" className="w-full text-center">
                ©2024
              </Text>
            </Tooltip>
          )}
        </div>
      </Sider>
      <Layout>{children}</Layout>
    </Layout>
  );
};
