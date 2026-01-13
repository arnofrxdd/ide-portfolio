export const THEMES = {
    // --- DARK THEMES ---
    default: {
        name: 'Dark Modern',
        colors: {
            '--bg-main': '#0a0a0c',
            '--bg-panel': '#0f0f11',
            '--bg-activity': '#050505',
            '--border': '#1e293b',
            '--accent': '#6366f1', // Indigo
            '--text-primary': '#e2e8f0',
            '--text-secondary': '#94a3b8',
            '--selection': 'rgba(99, 102, 241, 0.3)',
            '--line-number': '#475569',
            '--line-number-active': '#e2e8f0',
            // New Homepage Specifics
            '--hero-gradient-start': '#818cf8', // Indigo 400
            '--hero-gradient-end': '#22d3ee',   // Cyan 400
            '--success': '#34d399',             // Emerald
            '--warning': '#fbbf24',             // Amber
            '--info': '#38bdf8',                // Sky
        }
    },
    vscode: {
        name: 'VS Code Dark+',
        colors: {
            '--bg-main': '#1e1e1e',
            '--bg-panel': '#252526',
            '--bg-activity': '#333333',
            '--border': '#2a2a2a',
            '--accent': '#007acc',
            '--text-primary': '#d4d4d4',
            '--text-secondary': '#9da0a6',
            '--selection': '#264f78',
            '--line-number': '#858585',
            '--line-number-active': '#c6c6c6',
            // VS Code Specifics
            '--hero-gradient-start': '#007acc',
            '--hero-gradient-end': '#00b4d8',
            '--success': '#4ec9b0',
            '--warning': '#cca700',
            '--info': '#9cdcfe',
        }
    },
    githubDark: {
        name: 'GitHub Dark',
        colors: {
            '--bg-main': '#0d1117',
            '--bg-panel': '#161b22',
            '--bg-activity': '#010409',
            '--border': '#30363d',
            '--accent': '#58a6ff',
            '--text-primary': '#f0f6fc',
            '--text-secondary': '#8b949e',
            '--selection': 'rgba(56, 139, 253, 0.3)',
            '--line-number': '#6e7681',
            '--line-number-active': '#f0f6fc',
            // GitHub Specifics
            '--hero-gradient-start': '#58a6ff', // Blue
            '--hero-gradient-end': '#bc8cff',   // Purple
            '--success': '#3fb950',
            '--warning': '#d29922',
            '--info': '#58a6ff',
        }
    },
    dracula: {
        name: 'Dracula',
        colors: {
            '--bg-main': '#282a36',
            '--bg-panel': '#21222c',
            '--bg-activity': '#191a21',
            '--border': '#44475a',
            '--accent': '#ff79c6', // Pink
            '--text-primary': '#f8f8f2',
            '--text-secondary': '#6272a4',
            '--selection': 'rgba(68, 71, 90, 0.5)',
            '--line-number': '#6272a4',
            '--line-number-active': '#f8f8f2',
            // Dracula Specifics
            '--hero-gradient-start': '#ff79c6', // Pink
            '--hero-gradient-end': '#bd93f9',   // Purple
            '--success': '#50fa7b',             // Green
            '--warning': '#ffb86c',             // Orange
            '--info': '#8be9fd',                // Cyan
        }
    },
    nord: {
        name: 'Nord',
        colors: {
            '--bg-main': '#2e3440',
            '--bg-panel': '#3b4252',
            '--bg-activity': '#2e3440',
            '--border': '#434c5e',
            '--accent': '#88c0d0', // Nord Frost
            '--text-primary': '#eceff4', // Nord Snow Storm
            '--text-secondary': '#d8dee9',
            '--selection': 'rgba(136, 192, 208, 0.3)',
            '--line-number': '#4c566a',
            '--line-number-active': '#eceff4',
            // Nord Specifics
            '--hero-gradient-start': '#88c0d0', // Frost Blue
            '--hero-gradient-end': '#5e81ac',   // Frost Dark Blue
            '--success': '#a3be8c',             // Aurora Green
            '--warning': '#ebcb8b',             // Aurora Yellow
            '--info': '#81a1c1',                // Frost Blue
        }
    },
    solarizedDark: {
        name: 'Solarized Dark',
        colors: {
            '--bg-main': '#002b36',
            '--bg-panel': '#073642',
            '--bg-activity': '#00252e',
            '--border': '#586e75',
            '--accent': '#268bd2', // Blue
            '--text-primary': '#fdf6e3', // Base3
            '--text-secondary': '#93a1a1', // Base1
            '--selection': 'rgba(38, 139, 210, 0.3)',
            '--line-number': '#586e75',
            '--line-number-active': '#93a1a1',
            // Solarized Specifics
            '--hero-gradient-start': '#b58900', // Yellow
            '--hero-gradient-end': '#2aa198',   // Cyan
            '--success': '#859900',
            '--warning': '#cb4b16',
            '--info': '#2aa198',
        }
    },
    gruvbox: {
        name: 'Gruvbox Dark',
        colors: {
            '--bg-main': '#282828',
            '--bg-panel': '#3c3836',
            '--bg-activity': '#1d2021',
            '--border': '#504945',
            '--accent': '#fe8019', // Orange
            '--text-primary': '#ebdbb2',
            '--text-secondary': '#a89984',
            '--selection': 'rgba(254, 128, 25, 0.3)',
            '--line-number': '#7c6f64',
            '--line-number-active': '#ebdbb2',
            // Gruvbox Specifics
            '--hero-gradient-start': '#fb4934', // Red
            '--hero-gradient-end': '#fabd2f',   // Yellow
            '--success': '#b8bb26',
            '--warning': '#fabd2f',
            '--info': '#83a598',
        }
    },
    synthwave: {
        name: "Synthwave '84",
        colors: {
            '--bg-main': '#262335',
            '--bg-panel': '#241b2f',
            '--bg-activity': '#171520', // Deep purple
            '--border': '#495495', // Purple border
            '--accent': '#ff71ce', // Neon Pink
            '--text-primary': '#fffeb6', // Glow Yellow/White
            '--text-secondary': '#b6b1b1',
            '--selection': 'rgba(255, 113, 206, 0.4)',
            '--line-number': '#36345d',
            '--line-number-active': '#fffeb6',
            // Synthwave Specifics
            '--hero-gradient-start': '#ff71ce', // Neon Pink
            '--hero-gradient-end': '#01cdfe',   // Neon Cyan
            '--success': '#05ffa1',             // Neon Green
            '--warning': '#fffb96',             // Neon Yellow
            '--info': '#01cdfe',
        }
    },
    highContrast: {
        name: 'High Contrast',
        colors: {
            '--bg-main': '#000000',
            '--bg-panel': '#000000',
            '--bg-activity': '#000000',
            '--border': '#FFFFFF', // Stark White Border
            '--accent': '#FFFF00', // Pure Yellow
            '--text-primary': '#FFFFFF',
            '--text-secondary': '#00FF00', // Terminal Green
            '--selection': 'rgba(255, 255, 255, 0.4)',
            '--line-number': '#FFFFFF',
            '--line-number-active': '#FFFF00',
            // HC Specifics
            '--hero-gradient-start': '#FFFF00',
            '--hero-gradient-end': '#FFFFFF',
            '--success': '#00FF00',
            '--warning': '#FFFF00',
            '--info': '#00FFFF',
        }
    },

    monokai: {
        name: 'Monokai',
        colors: {
            '--bg-main': '#272822',
            '--bg-panel': '#1e1f1c',
            '--bg-activity': '#171814',
            '--border': '#49483e',
            '--accent': '#a6e22e', // Green
            '--text-primary': '#f8f8f2',
            '--text-secondary': '#75715e',
            '--selection': 'rgba(73, 72, 62, 0.6)',
            '--line-number': '#90908a',
            '--line-number-active': '#f8f8f2',
            // Monokai Specifics
            '--hero-gradient-start': '#a6e22e', // Green
            '--hero-gradient-end': '#fd971f',   // Orange
            '--success': '#a6e22e',
            '--warning': '#fd971f',
            '--info': '#66d9ef',
        }
    },
    // --- LIGHT THEMES ---
    githubLight: {
        name: 'GitHub Light',
        colors: {
            '--bg-main': '#ffffff',
            '--bg-panel': '#f6f8fa',
            '--bg-activity': '#f0f3f6',
            '--border': '#d0d7de',
            '--accent': '#0969da',
            '--text-primary': '#1f2328',
            '--text-secondary': '#656d76',
            '--selection': 'rgba(9, 105, 218, 0.2)',
            '--line-number': '#8c959f',
            '--line-number-active': '#1f2328',
            // Light Specifics
            '--hero-gradient-start': '#0969da',
            '--hero-gradient-end': '#8250df',
            '--success': '#1a7f37',
            '--warning': '#9a6700',
            '--info': '#0969da',
        }
    }
};
