import { PropsWithChildren, useContext, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { UserOutlined, VideoCameraOutlined, UploadOutlined } from '@ant-design/icons';
import { Layout, Menu, Switch, theme } from 'antd';
import { ThemeContext } from 'src/app/App';

const { Header, Content, Footer, Sider } = Layout;

type Props = {
  toggleTheme: () => void;
};

export const MainMenu = ({ toggleTheme, children }: PropsWithChildren<Props>) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useContext(ThemeContext);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme={theme}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}>
        <Switch
          checkedChildren="Dark"
          unCheckedChildren="Light"
          defaultChecked
          onChange={toggleTheme}
        />
        <div className="demo-logo-vertical" />
        <Menu defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<UserOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            Videos
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            Upload
          </Menu.Item>
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
