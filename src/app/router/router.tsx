import { createBrowserRouter } from 'react-router-dom';
import { SignInPage, MainPage } from '@pages/index';
import { RootWidget } from '@widgets/root';
import { RegisterPage } from '@pages/register';

export const router = createBrowserRouter([
  {
    path: 'signin',
    element: <SignInPage />,
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <RootWidget />,
    children: [
      {
        path: '',
        element: <MainPage />,
      },
    ],
  },
]);
