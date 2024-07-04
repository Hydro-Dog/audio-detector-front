import { createContext, useContext, useState } from 'react';
import { PropsWithChildrenOnly } from '@shared/types';

type CustomThemeContextType = { theme: string; toggleTheme: () => void };

const initialCustomThemeContextValue: CustomThemeContextType = {
  theme: 'light',
  toggleTheme: () => null,
};

const ThemeContext = createContext<CustomThemeContextType>(initialCustomThemeContextValue);

export const useTheme = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }: PropsWithChildrenOnly) => {
  const [theme, setTheme] = useState<string>(localStorage.getItem('colorTheme') || 'light');

  const toggleTheme = () => {
    const value = theme === 'light' ? 'dark' : 'light';
    setTheme(value);
    localStorage.setItem('colorTheme', value);
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
