import { createBrowserRouter } from 'react-router-dom';
import { SignInPage, MainPage, RegisterPage, UserProfilePage } from '@pages/index';
import { ROUTES } from '@shared/enum';
import { MainMenu } from '@shared/index';
import { GuarderRoute } from './guarder-route';

export const router = createBrowserRouter([
  {
    path: ROUTES.SIGN_IN,
    element: <SignInPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.ROOT,
    element: (
      <GuarderRoute>
        <MainMenu />
      </GuarderRoute>
    ),
    children: [
      {
        path: '',
        element: <MainPage />,
      },
      // {
      //   path: ROUTES.PROFILE,
      //   element: <UserProfilePage />,
      // },
    ],
  },
]);
