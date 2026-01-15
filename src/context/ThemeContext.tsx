import { createContext } from 'react';

export const ThemeContext = createContext({
    theme: 'darkModern',
    setTheme: (theme: string) => { }
});
