import { PropsWithChildren, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { ROUTES } from '@shared/enum';
import { useTheme } from '@shared/index';
import { Layout, Menu } from 'antd';

const { Footer, Sider } = Layout;
const { Item } = Menu;

export const MainMenuWidget = ({ children }: PropsWithChildren<Record<never, any>>) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<ROUTES[]>([]);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  //TODO: вынести в хук useGetCurrentRoot
  const getFirstPathSegment = (pathname: string): ROUTES => {
    const segments = pathname.split('/').filter(Boolean);
    return (segments.length ? segments[0] : '') as ROUTES;
  };

  const onMenuItemClick = (path: string) => {
    navigate(path);
  };

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
