import { createBrowserRouter } from 'react-router-dom';
import { SignInPage, MainPage } from '@pages/index';

export const router = createBrowserRouter([
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
