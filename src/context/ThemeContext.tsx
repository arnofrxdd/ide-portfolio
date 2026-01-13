import { createContext } from 'react';

export const ThemeContext = createContext({
    theme: 'default',
    setTheme: (theme: string) => { }
});
