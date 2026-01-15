export const THEMES = {
    // --- DARK THEMES ---
    darkModern: {
        name: 'Dark Modern',
        colors: {
            '--bg-main': '#1F1F1F',
            '--bg-panel': '#181818',
            '--bg-activity': '#181818',
            '--border': '#2B2B2B',
            '--accent': '#0078D4',
            '--text-primary': '#CCCCCC',
            '--text-secondary': '#9D9D9D',
            '--selection': '#264F78',
            '--line-number': '#6E7681',
            '--line-number-active': '#CCCCCC',
            // VS Code Specifics
            '--hero-gradient-start': '#0078D4',
            '--hero-gradient-end': '#00b4d8',
            '--success': '#4EC9B0',
            '--warning': '#CCA700',
            '--info': '#9CDCFE',
        }
    },
    midnight: {
        name: 'Midnight (Custom)',
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
            '--border': '#2a2a2a', // Authentic border might be closer to #444 or none, but #2a2a2a is standard for Dark+
            '--accent': '#007acc',
            '--text-primary': '#d4d4d4',
            '--text-secondary': '#9da0a6', // Often approximation of descriptionForeground
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
            '--bg-panel': '#161b22', // gh-dark-bg-subtle
            '--bg-activity': '#010409', // gh-dark-bg
            '--border': '#30363d', // gh-dark-border
            '--accent': '#1f6feb', // gh-dark-accent
            '--text-primary': '#c9d1d9', // gh-dark-fg
            '--text-secondary': '#8b949e', // gh-dark-text-secondary
            '--selection': '#1f6feb', // Using accent for selection highlight (approx)
            '--line-number': '#6e7681',
            '--line-number-active': '#c9d1d9',
            // GitHub Specifics
            '--hero-gradient-start': '#1f6feb',
            '--hero-gradient-end': '#a371f7',
            '--success': '#238636', // gh-dark-success
            '--warning': '#9e6a03', // gh-dark-warning
            '--info': '#388bfd',
        }
    },
    dracula: {
        name: 'Dracula',
        colors: {
            '--bg-main': '#282a36',
            '--bg-panel': '#21222c', // Specific dark variant
            '--bg-activity': '#191a21', // Darker background
            '--border': '#6272a4', // Comment/Selection color often used as border
            '--accent': '#bd93f9', // Purple is often the primary accent
            '--text-primary': '#f8f8f2',
            '--text-secondary': '#6272a4', // Comment color
            '--selection': '#44475a',
            '--line-number': '#6272a4',
            '--line-number-active': '#f8f8f2',
            // Dracula Specifics
            '--hero-gradient-start': '#bd93f9', // Purple
            '--hero-gradient-end': '#ff79c6',   // Pink
            '--success': '#50fa7b',
            '--warning': '#ffb86c',
            '--info': '#8be9fd',
        }
    },
    nord: {
        name: 'Nord',
        colors: {
            '--bg-main': '#2e3440', // nord0
            '--bg-panel': '#3b4252', // nord1
            '--bg-activity': '#2e3440', // nord0
            '--border': '#4c566a', // nord3 (often used as UI element boundary)
            '--accent': '#88c0d0', // nord8 (Frost)
            '--text-primary': '#d8dee9', // nord4
            '--text-secondary': '#4c566a', // nord3
            '--selection': '#434c5e', // nord2
            '--line-number': '#4c566a', // nord3
            '--line-number-active': '#d8dee9', // nord4
            // Nord Specifics
            '--hero-gradient-start': '#88c0d0', // nord8
            '--hero-gradient-end': '#81a1c1',   // nord9
            '--success': '#a3be8c', // nord14
            '--warning': '#ebcb8b', // nord13
            '--info': '#5e81ac', // nord10
        }
    },
    solarizedDark: {
        name: 'Solarized Dark',
        colors: {
            '--bg-main': '#002b36',
            '--bg-panel': '#073642',
            '--bg-activity': '#002b36',
            '--border': '#073642',
            '--accent': '#268bd2',
            '--text-primary': '#93a1a1', // Content text (base1)
            '--text-secondary': '#586e75', // Comments (base01)
            '--selection': '#073642', // Background highlight
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
            '--accent': '#fb4934', // Red is often the "primary" accent, or Orange #fe8019
            '--text-primary': '#ebdbb2',
            '--text-secondary': '#a89984',
            '--selection': '#504945', // Selection background
            '--line-number': '#7c6f64',
            '--line-number-active': '#ebdbb2',
            // Gruvbox Specifics
            '--hero-gradient-start': '#fb4934',
            '--hero-gradient-end': '#fabd2f',
            '--success': '#b8bb26',
            '--warning': '#fabd2f',
            '--info': '#83a598',
        }
    },
    synthwave: {
        name: "Synthwave '84",
        colors: {
            '--bg-main': '#262335',
            '--bg-panel': '#241b2f', // Darker purple
            '--bg-activity': '#171520',
            '--border': '#2d2b55', // Deep purple border
            '--accent': '#ff71ce', // Neon Pink
            '--text-primary': '#fffeb6', // Glow Yellow/White
            '--text-secondary': '#848bbd', // Muted purple/blue
            '--selection': '#463465', // Selection background
            '--line-number': '#848bbd',
            '--line-number-active': '#feffff',
            // Synthwave Specifics
            '--hero-gradient-start': '#ff71ce',
            '--hero-gradient-end': '#01cdfe',
            '--success': '#05ffa1',
            '--warning': '#fffb96',
            '--info': '#01cdfe',
        }
    },
    highContrast: {
        name: 'High Contrast',
        colors: {
            '--bg-main': '#000000',
            '--bg-panel': '#000000',
            '--bg-activity': '#000000',
            '--border': '#6FC3DF', // Contrasting Border (often Cyan or White)
            '--accent': '#FC9867', // Orange/Yellow
            '--text-primary': '#FFFFFF',
            '--text-secondary': '#FFFFFF', // High contrast means everything matches
            '--selection': '#FFFFFF33',
            '--line-number': '#FFFFFF',
            '--line-number-active': '#FFFFFF',
            // HC Specifics
            '--hero-gradient-start': '#FFFF00',
            '--hero-gradient-end': '#FFFF00',
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
            '--border': '#272822',
            '--accent': '#f92672',
            '--text-primary': '#f8f8f2',
            '--text-secondary': '#75715e',
            '--selection': '#49483e',
            '--line-number': '#90908a',
            '--line-number-active': '#f8f8f2',
            // Monokai Specifics
            '--hero-gradient-start': '#f92672',
            '--hero-gradient-end': '#a6e22e',
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
            '--bg-activity': '#ffffff',
            '--border': '#d0d7de',
            '--accent': '#0969da',
            '--text-primary': '#1f2328',
            '--text-secondary': '#656d76',
            '--selection': '#d0d7de',
            '--line-number': '#8c959f',
            '--line-number-active': '#1f2328',
            // Light Specifics
            '--hero-gradient-start': '#0969da',
            '--hero-gradient-end': '#2188ff',
            '--success': '#1a7f37',
            '--warning': '#9a6700',
            '--info': '#0969da',
        }
    }
};
