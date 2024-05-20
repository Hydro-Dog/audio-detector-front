import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { AudioContextProvider, useTheme } from '@shared/index';
import { store } from '@store/index';
import { ConfigProvider, Switch, theme as antTheme } from 'antd';
import { router } from './router/router';
import './index.css';

export const App = () => {
  const { theme, toggleTheme } = useTheme();

  const themeConfig = {
    algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
  };

  return (
    <React.StrictMode>
      <StoreProvider store={store}>
        <ConfigProvider theme={themeConfig}>
          <AudioContextProvider>
            <div className={theme === 'dark' ? 'bg-black' : 'bg-white'}>
              <Switch
                className="absolute right-4 top-4"
                checkedChildren="Dark"
                unCheckedChildren="Light"
                defaultChecked
                onChange={toggleTheme}
              />
              <RouterProvider router={router} />
            </div>
          </AudioContextProvider>
        </ConfigProvider>
      </StoreProvider>
    </React.StrictMode>
  );
};
