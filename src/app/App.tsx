import React, { createContext, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { MainMenu } from '@widgets/index';
import { ConfigProvider, theme } from 'antd';
import { router } from './router/router';
import './index.css';

//TODO: перенести в widgets
export const ThemeContext = createContext<{ theme: 'light' | 'dark' }>({ theme: 'light' });

export const App = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [collapsed, setCollapsed] = useState(false);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themeConfig = {
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };

  return (
    <React.StrictMode>
      <ThemeContext.Provider value={{ theme: currentTheme }}>
        <ConfigProvider theme={themeConfig}>
          <MainMenu toggleTheme={toggleTheme}>
            <RouterProvider router={router} />
          </MainMenu>
        </ConfigProvider>
      </ThemeContext.Provider>
    </React.StrictMode>
  );
};
