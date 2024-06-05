import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import {
  MediaContextProvider,
  NotificationContextProvider,
  useNotification,
  useTheme,
} from '@shared/index';
import { store } from '@store/index';
import { ConfigProvider, Switch, theme as antTheme } from 'antd';
import { router } from './router/router';
import './index.css';

export const App = () => {
  const { theme, toggleTheme } = useTheme();
  const themeConfig = {
    algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
  };
  const { openNotification, NotificationContext: NotificationCtx } = useNotification();

  return (
    <React.StrictMode>
      <StoreProvider store={store}>
        <ConfigProvider theme={themeConfig}>
          <MediaContextProvider>
            <NotificationContextProvider openNotification={openNotification}>
              <div className={theme === 'dark' ? 'bg-black' : 'bg-white'}>
                <Switch
                  className="absolute right-4 top-4"
                  checkedChildren="Dark"
                  unCheckedChildren="Light"
                  defaultChecked
                  onChange={toggleTheme}
                />
                <RouterProvider router={router} />
                <NotificationCtx />
              </div>
            </NotificationContextProvider>
          </MediaContextProvider>
        </ConfigProvider>
      </StoreProvider>
    </React.StrictMode>
  );
};
