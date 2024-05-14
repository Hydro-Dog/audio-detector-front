import { PropsWithChildren } from 'react';
import { MainMenuWidget } from '@widgets/index';

export const RootWidget = ({ children }: PropsWithChildren<Record<never, never>>) => {
  return <MainMenuWidget>{children}</MainMenuWidget>;
};
