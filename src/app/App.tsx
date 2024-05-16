import React, { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useTheme } from '@shared/theme';
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
      <ConfigProvider theme={themeConfig}>
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
      </ConfigProvider>
    </React.StrictMode>
  );
};
