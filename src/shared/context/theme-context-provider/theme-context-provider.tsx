import { createContext, useContext, useState } from 'react';
import { PropsWithChildrenOnly } from '@shared/types';

type CustomThemeContextType = { theme: 'light' | 'dark'; toggleTheme: () => void };

const initialCustomThemeContextValue: CustomThemeContextType = {
  theme: 'light',
  toggleTheme: () => null,
};

const ThemeContext = createContext<CustomThemeContextType>(initialCustomThemeContextValue);

export const useTheme = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }: PropsWithChildrenOnly) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
