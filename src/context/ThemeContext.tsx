import { createContext } from 'react';

export const ThemeContext = createContext({
    theme: 'darkModern',
    setTheme: (theme: string) => { },
    homepageLayout: 'modern' as 'modern' | 'vscode',
    setHomepageLayout: (_layout: 'modern' | 'vscode') => { }
});
