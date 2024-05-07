import React, { createContext, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { MainMenuWidget } from '@widgets/index';
import { ConfigProvider, theme as antTheme } from 'antd';
import { router } from './router/router';
import './index.css';
import { CustomThemeProvider, useTheme } from '@shared/theme';

export const App = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [collapsed, setCollapsed] = useState(false);

  // const toggleTheme = () => {
  //   setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  // };

  const { theme } = useTheme();

  const themeConfig = {
    algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
  };

  return (
    <React.StrictMode>
      <ConfigProvider theme={themeConfig}>
        <MainMenuWidget>
          <RouterProvider router={router} />
        </MainMenuWidget>
      </ConfigProvider>
    </React.StrictMode>
  );
};
