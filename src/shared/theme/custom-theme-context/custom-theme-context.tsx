/* eslint-disable @typescript-eslint/no-empty-function */
import { PropsWithChildren, createContext, useContext, useState } from 'react';

const CustomThemeContext = createContext<{ theme: 'light' | 'dark'; toggleTheme: () => void }>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(CustomThemeContext);

export const CustomThemeProvider = ({ children }: PropsWithChildren<Record<never, any>>) => {
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
