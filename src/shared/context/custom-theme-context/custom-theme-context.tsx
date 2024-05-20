/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from 'react';
import { PropsWithChildrenOnly } from '@shared/types';

type CustomThemeContextType = { theme: 'light' | 'dark'; toggleTheme: () => void };

const initialCustomThemeContextValue: CustomThemeContextType = {
  theme: 'light',
  toggleTheme: () => {},
};

const CustomThemeContext = createContext<CustomThemeContextType>(initialCustomThemeContextValue);

export const useTheme = () => useContext(CustomThemeContext);

export const CustomThemeProvider = ({ children }: PropsWithChildrenOnly) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <CustomThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </CustomThemeContext.Provider>
  );
};
