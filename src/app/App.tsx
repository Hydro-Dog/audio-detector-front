import React, { useState } from 'react';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MainPage from '@pages/main-page/main-page';
import { SignInPage } from '@pages/sign-in/sign-in-page.tsx';
import { ConfigProvider, Switch, theme } from 'antd';

const router = createBrowserRouter([
  {
    path: '/signin',
    element: <SignInPage />,
  },
  {
    path: '/',
    element: <MainPage />,
  },
  // {
  //   path: '/profile',
  //   element: <ProfilePage />
  // },
]);

export const App = () => {
  console.log('theme: ', theme);
  const [currentTheme, setCurrentTheme] = useState('light');

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themeConfig = {
    algorithm: currentTheme === 'dark' ? [theme.darkAlgorithm] : theme.defaultAlgorithm,
  };

  return (
    <React.StrictMode>
      <ConfigProvider theme={themeConfig}>
        <Switch defaultChecked onChange={toggleTheme} />
        <RouterProvider router={router} />
      </ConfigProvider>
    </React.StrictMode>
  );
};
