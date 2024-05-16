import { Outlet } from 'react-router-dom';
import { MainMenuWidget } from '@widgets/index';

export const MainMenu = () => {
  return (
    <MainMenuWidget>
      <Outlet />
    </MainMenuWidget>
  );
};
