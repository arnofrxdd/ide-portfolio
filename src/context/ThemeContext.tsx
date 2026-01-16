import { createContext } from 'react';

export const ThemeContext = createContext({
    theme: 'darkModern',
    setTheme: (_theme: string) => { },
    installedThemes: [] as string[],
    installTheme: (_theme: string) => { },
    uninstallTheme: (_theme: string) => { },
    homepageLayout: 'modern' as 'modern' | 'vscode',
    setHomepageLayout: (_layout: 'modern' | 'vscode') => { }
});
