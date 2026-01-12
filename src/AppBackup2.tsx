import React, { useState, useEffect, useRef, useCallback, createContext, useContext, useMemo } from 'react';
import {
    Github, ExternalLink, X, ChevronRight, ChevronDown,
    Code, Terminal, Database, Cpu, Globe, ArrowLeft,
    Send, Maximize2, Minimize2, GripHorizontal,
    FileCode, FileJson, FileText, Folder, FolderOpen,
    GitBranch, CheckCircle, Zap, Layout, Command,
    AlertCircle, Activity, Server, Lock, Layers,
    Play, Pause, RefreshCw, Box, Shield, Clock, HardDrive,
    Search, Settings, User, File, ToggleLeft, ToggleRight,
    Filter, Download, Trash2, Plus, MoreHorizontal as MoreHorizontalIcon,
    Menu, Smartphone, Tablet, Square, Copy, Coffee, Bell, Wifi, Eye, Edit3,
    Palette, Search as SearchIcon, MoreVertical, Copy as CopyIcon, MinusCircle, MousePointer2
} from 'lucide-react';

// --- DATA MOCKS (For Preview Runtime Stability) ---
import { PROJECTS_DATA } from "./data/projects";
import FONT_5x7 from "./data/font5x7";

/* --- CONFIGURATION & DATA --- */
const apiKey = ""; // Set your API key here or via env vars

const SYSTEM_PROMPT = `
You are a CLI Assistant for Arnav's Portfolio. 
Answer purely in text/markdown suitable for a terminal window.
Keep responses concise, technical, and cool.
Data Context:
`;

/* --- THEME CONFIGURATION --- */
const THEMES = {
    // --- DARK THEMES ---
    default: {
        name: 'Dark Modern',
        colors: {
            '--bg-main': '#0a0a0c',
            '--bg-panel': '#0f0f11',
            '--bg-activity': '#050505',
            '--border': '#1e293b',
            '--accent': '#6366f1', // indigo
            '--text-primary': '#e2e8f0',
            '--text-secondary': '#94a3b8',
            '--selection': 'rgba(99, 102, 241, 0.3)',
            '--line-number': '#475569',
            '--line-number-active': '#e2e8f0',
        }
    },
    vscode: {
        name: 'VS Code Dark+',
        colors: {
            '--bg-main': '#1e1e1e',        // editor.background
            '--bg-panel': '#252526',       // sideBar.background
            '--bg-activity': '#333333',    // activityBar.background
            '--border': '#2a2a2a',         // subtle separators
            '--accent': '#007acc',
            '--text-primary': '#d4d4d4',   // editor.foreground
            '--text-secondary': '#9da0a6', // muted UI text
            '--selection': '#264f78',      // editor.selectionBackground
            '--line-number': '#858585',
            '--line-number-active': '#c6c6c6',
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
            '--text-primary': '#f0f6fc',  // Brightened GitHub White
            '--text-secondary': '#8b949e',
            '--selection': 'rgba(56, 139, 253, 0.3)',
            '--line-number': '#6e7681',
            '--line-number-active': '#f0f6fc',
        }
    },
    dracula: {
        name: 'Dracula',
        colors: {
            '--bg-main': '#282a36',
            '--bg-panel': '#21222c',
            '--bg-activity': '#191a21',
            '--border': '#44475a',
            '--accent': '#ff79c6',
            '--text-primary': '#ffffff',  // Brightened to pure white
            '--text-secondary': '#bd93f9', // Using bright purple for secondary
            '--selection': 'rgba(68, 71, 90, 0.5)',
            '--line-number': '#6272a4',
            '--line-number-active': '#ffffff',
        }
    },
    monokai: {
        name: 'Monokai',
        colors: {
            '--bg-main': '#272822',
            '--bg-panel': '#1e1f1c',
            '--bg-activity': '#171814',
            '--border': '#49483e',
            '--accent': '#a6e22e',
            '--text-primary': '#ffffff',  // Brightened
            '--text-secondary': '#e6db74', // Yellowish secondary
            '--selection': 'rgba(73, 72, 62, 0.6)',
            '--line-number': '#90908a',
            '--line-number-active': '#f8f8f2',
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
            '--text-primary': '#1f2328',  // Dark black/grey for readability
            '--text-secondary': '#656d76',
            '--selection': 'rgba(9, 105, 218, 0.2)',
            '--line-number': '#8c959f',
            '--line-number-active': '#1f2328',
        }
    }
};
const ThemeContext = createContext({
    theme: 'default',
    setTheme: () => { }
});


/* --- FILE CONTENT CONSTANTS --- */
const FILE_CONTENTS = {
    env: `
# Environment Variables
# CAUTION: Do not expose these!

API_KEY=hunter2
SECRET_SAUCE=caffeine_and_dreams
NODE_ENV=production
NEXT_PUBLIC_HIRE_ME=true
DB_HOST=localhost:5432
REDIS_URL=redis://cache:6379

# portfolio runtime flags
PORTFOLIO_MODE=maximum_effort
COFFEE_LEVEL=critical
SANITY_CHECK=skipped
`,
    projects_json: `
[
  ${PROJECTS_DATA.map(p => JSON.stringify({
        id: p.id,
        title: p.title,
        tech: p.tech,
        description: p.description
    }, null, 2)).join(',\n')}
]
`,
    word_wrap_from_hell: JSON.stringify(
        {
            warning: "DO NOT TURN OFF WORD WRAP",
            reason: "because some people like pain",
            payload: "A".repeat(50000)
        },
        null,
        2
    ),

    minimap_stress_test: `
{
  "meta": {
    "file": "minimap_stress_test.json",
    "purpose": "stress minimap scrolling",
    "vibes": "vertical suffering"
  },
  "rows": [
${Array.from({ length: 200 }, (_, i) => `
    {
      "row": ${i + 1},
      "status": "OK",
      "payload": {
        "numbers": [${i}, ${i + 1}, ${i + 2}, ${i + 3}, ${i + 4}],
        "nested": {
          "level": ${i % 5},
          "message": "scrolling intensifies"
        }
      }
    }${i < 199 ? "," : ""}
`).join("")}
  ]
}
`,
    package_json: `
{
  "name": "arnav-portfolio",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.292.0",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/node": "^20.9.0",
    "eslint": "^8.53.0",
    "prettier": "^3.1.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
`
    ,
    gitignore: `
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build
/dist

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# bad vibes
/bugs
/imposter_syndrome

# emotional damage
/burnout
`,
    hire_me: `
{
  "name": "Arnav",
  "role": "Software Engineer",
  "looking_for": [
    "Full-time roles",
    "Internships",
    "Contract / Freelance"
  ],
  "interests": [
    "Frontend architecture",
    "System-level tooling",
    "Networking & automation"
  ],
  "availability": "immediate",
  "work_style": "ship-first, iterate-fast",
  "status": "open_to_opportunities"
}
`,
    skills_json: `
{
  "frontend": ["React", "Vite", "Tailwind CSS", "Framer Motion"],
  "backend": ["Node.js", "Express", "REST APIs"],
  "systems": ["C++", "Win32 API", "Raw Input", "Multithreading"],
  "tooling": ["Git", "Linux", "Shell scripting"],
  "infra": ["Docker", "Networking", "Proxies & Tunnels"],
  "focus": "performance, clarity, reliability"
}
`,
    career_path: `
student
developer
senior developer
why am I doing frontend animations at 3am
`,
    terminal_component: `
import React, { useState } from 'react';

export const Terminal = () => {
  const [output, setOutput] = useState(['> system_init']);

  // This component powers the CLI interface 
  // you see at the bottom of the screen!
  
  return (
    <div className="terminal-window">
      {output.map(line => (
        <div className="line">{line}</div>
      ))}
      <span className="cursor animate-pulse">_</span>
    </div>
  );
};
`,
    window_component: `
import React from 'react';

// The logic behind the draggable windows
// Uses absolute positioning and mouse event listeners.
// Yes, this is intentionally overengineered.

export const DraggableWindow = ({ children, x, y }) => {
  return (
    <div 
      style={{ top: y, left: x }} 
      className="absolute shadow-2xl border border-slate-700"
    >
      <div className="title-bar">Drag Me</div>
      <div className="content">
        {children}
      </div>
    </div>
  );
};
`
};

/* --- UNIFIED FILE SYSTEM CONFIGURATION --- */
const FILE_SYSTEM_CONFIG = {
    filenames: {
        ".env": { icon: Lock, color: "text-orange-400" },
        ".gitignore": { icon: GitBranch, color: "text-orange-400" },
        "package.json": { icon: Box, color: "text-red-400" },
        "readme.md": { icon: FileText, color: "text-purple-400" },
        "license": { icon: FileText, color: "text-yellow-400" },
        "dockerfile": { icon: Server, color: "text-blue-400" },
    },
    extensions: {
        tsx: { icon: FileCode, color: "text-blue-400" },
        ts: { icon: FileCode, color: "text-blue-400" },
        jsx: { icon: FileCode, color: "text-yellow-400" },
        js: { icon: FileJson, color: "text-yellow-400" },
        json: { icon: FileJson, color: "text-yellow-400" },
        html: { icon: FileCode, color: "text-orange-400" },
        css: { icon: FileCode, color: "text-blue-300" },
        md: { icon: FileText, color: "text-cyan-400" },
        txt: { icon: FileText, color: "text-slate-400" },
        env: { icon: Lock, color: "text-orange-400" },
        py: { icon: FileCode, color: "text-green-400" },
        go: { icon: FileCode, color: "text-sky-400" },
        cpp: { icon: FileCode, color: "text-blue-600" },
        c: { icon: FileCode, color: "text-slate-400" },
    },
    default: { icon: FileText, color: "text-slate-400" }
};

const getFileIcon = (filename) => {
    if (!filename) return FILE_SYSTEM_CONFIG.default;
    const lowerName = filename.toLowerCase();
    if (FILE_SYSTEM_CONFIG.filenames[lowerName]) return FILE_SYSTEM_CONFIG.filenames[lowerName];
    const ext = lowerName.split('.').pop();
    if (FILE_SYSTEM_CONFIG.extensions[ext]) return FILE_SYSTEM_CONFIG.extensions[ext];
    return FILE_SYSTEM_CONFIG.default;
};

const getTechColorStyles = (tech) => {
    const map = {
        "React": "text-cyan-400 border-cyan-400/30 bg-cyan-950/30",
        "Vue": "text-emerald-400 border-emerald-400/30 bg-emerald-950/30",
        "Next.js": "text-slate-200 border-slate-400/30 bg-slate-900/40",
        "Tailwind": "text-cyan-300 border-cyan-400/30 bg-cyan-950/20",
        "HTML": "text-orange-400 border-orange-400/30 bg-orange-950/30",
        "CSS": "text-blue-300 border-blue-400/30 bg-blue-950/30",
        "Chart.js": "text-pink-400 border-pink-400/30 bg-pink-950/30",
        "Node.js": "text-green-500 border-green-500/30 bg-green-950/30",
        "Express": "text-lime-400 border-lime-400/30 bg-lime-950/30",
        "TypeScript": "text-blue-400 border-blue-400/30 bg-blue-950/30",
        "Python": "text-yellow-400 border-yellow-400/30 bg-yellow-950/30",
        "Go": "text-sky-400 border-sky-400/30 bg-sky-950/30",
        "Java": "text-red-400 border-red-400/30 bg-red-950/30",
        "MongoDB": "text-green-400 border-green-400/30 bg-green-950/30",
        "PostgreSQL": "text-indigo-400 border-indigo-400/30 bg-indigo-950/30",
        "MySQL": "text-blue-400 border-blue-400/30 bg-blue-950/30",
        "Redis": "text-red-400 border-red-400/30 bg-red-950/30",
        "Git": "text-orange-400 border-orange-400/30 bg-orange-950/30",
        "GitHub": "text-slate-200 border-slate-400/30 bg-slate-800/40",
        "Linux": "text-yellow-300 border-yellow-400/30 bg-yellow-950/20",
        "Docker": "text-sky-400 border-sky-400/30 bg-sky-950/30",
    };
    return map[tech] || "text-slate-300 border-slate-600/30 bg-slate-800/30";
};

/* --- REAL MINIMAP COMPONENT (FIXED) --- */
const RealMinimap = ({ content, editorRef }) => {
    const minimapRef = useRef(null);
    const codeContentRef = useRef(null);
    const [viewport, setViewport] = useState({ top: 0, height: 0 });
    const isDragging = useRef(false);

    // Track the max travel distance for drag calculations
    const scrollTrackMaxRef = useRef(0);

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor) return;

        const updateMap = () => {
            if (!minimapRef.current || !codeContentRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } = editor;
            const mapHeight = minimapRef.current.clientHeight;
            const miniCodeHeight = codeContentRef.current.scrollHeight;

            if (mapHeight === 0 || miniCodeHeight === 0) return;

            // 1. Calculate Slider Height (Proportional)
            // Ratio: visible_code / total_code = slider_height / total_mini_code
            let sliderHeight = (clientHeight / scrollHeight) * miniCodeHeight;

            // Clamp slider height to be usable
            const MIN_SLIDER_HEIGHT = 20;
            sliderHeight = Math.max(MIN_SLIDER_HEIGHT, sliderHeight);

            // If code fits entirely in view, slider is full height of mini representation
            if (scrollHeight <= clientHeight) {
                sliderHeight = miniCodeHeight;
            }

            // 2. Calculate Scroll Percentage
            const maxScrollTop = scrollHeight - clientHeight;
            const scrollPercent = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
            const safePercent = Math.max(0, Math.min(1, scrollPercent));

            let sliderTop = 0;
            let mapTranslateY = 0;

            // --- LOGIC FORK: BIG FILES VS SMALL FILES ---

            // CASE 1: Small/Medium File (Minimap representation fits inside container)
            // The code in minimap does NOT scroll. The slider moves over it.
            if (miniCodeHeight <= mapHeight) {
                mapTranslateY = 0;

                // Slider travels from 0 to (miniCodeHeight - sliderHeight)
                const maxSliderTop = Math.max(0, miniCodeHeight - sliderHeight);
                sliderTop = safePercent * maxSliderTop;

                scrollTrackMaxRef.current = maxSliderTop;
            }
            // CASE 2: Big File (Minimap representation is taller than container)
            // The slider stays relatively static/proportional while content scrolls underneath
            else {
                // Slider travels from 0 to (mapHeight - sliderHeight)
                const maxSliderMove = mapHeight - sliderHeight;
                sliderTop = safePercent * maxSliderMove;

                // Content scrolls from 0 to (miniCodeHeight - mapHeight)
                const maxContentScroll = miniCodeHeight - mapHeight;
                mapTranslateY = safePercent * maxContentScroll;

                scrollTrackMaxRef.current = maxSliderMove;
            }

            setViewport({ top: sliderTop, height: sliderHeight });

            if (codeContentRef.current) {
                codeContentRef.current.style.transform = `translateY(-${mapTranslateY}px)`;
            }
        };

        // Attach listeners
        editor.addEventListener('scroll', updateMap);
        const observer = new ResizeObserver(updateMap);
        observer.observe(editor);
        observer.observe(minimapRef.current); // Watch minimap resize too

        // Initial update
        requestAnimationFrame(updateMap);

        return () => {
            editor.removeEventListener('scroll', updateMap);
            observer.disconnect();
        };
    }, [editorRef, content]);

    const teleport = (e) => {
        const editor = editorRef.current;
        if (!editor || !minimapRef.current || !codeContentRef.current) return;

        const minimapRect = minimapRef.current.getBoundingClientRect();
        const clickY = e.clientY - minimapRect.top;

        const miniContentHeight = codeContentRef.current.scrollHeight;
        const editorScrollHeight = editor.scrollHeight;
        const editorClientHeight = editor.clientHeight;

        // Clamp click inside minimap
        const clampedY = Math.max(0, Math.min(clickY, minimapRect.height));

        // Convert click position → percentage of minimap content
        const percent = miniContentHeight <= minimapRect.height
            ? clampedY / miniContentHeight
            : (clampedY + Math.abs(
                parseFloat(
                    codeContentRef.current.style.transform
                        ?.replace('translateY(', '')
                        ?.replace('px)', '') || 0
                ))) / miniContentHeight;

        // Jump editor directly to that position
        editor.scrollTop = percent * (editorScrollHeight - editorClientHeight);
    };


    const handleMouseDown = (e) => {
        const rect = minimapRef.current.getBoundingClientRect();
        const clickY = e.clientY - rect.top;

        // Check if clicked ON the slider
        const isSlider = clickY >= viewport.top && clickY <= viewport.top + viewport.height;

        if (!isSlider) {
            teleport(e);
        }

        isDragging.current = true;
    };

    useEffect(() => {
        const handleMove = (e) => {
            if (!isDragging.current || !minimapRef.current) return;
            e.preventDefault();
            teleport(e);
        };

        const handleUp = () => {
            isDragging.current = false;
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [viewport.height]); // Re-bind if viewport height changes significantly to keep logic fresh

    return (
        <div
            ref={minimapRef}
            onMouseDown={handleMouseDown}
            className="w-24 bg-[var(--bg-main)] border-l border-[var(--border)] relative hidden md:block select-none overflow-hidden shrink-0"
        >
            {/* Code Representation */}
            <div ref={codeContentRef} className="absolute top-0 left-0 w-full opacity-60 pointer-events-none p-1 transition-transform duration-75 will-change-transform">
                <div className="text-[2px] leading-[4px] text-[var(--text-secondary)] font-mono whitespace-pre-wrap break-all select-none">
                    {content}
                </div>
            </div>

            {/* Viewport Slider Overlay */}
            <div
                style={{ top: viewport.top, height: viewport.height }}
                className="absolute left-0 w-full bg-[var(--text-secondary)]/10 hover:bg-[var(--text-secondary)]/20 transition-colors border-y border-[var(--selection)] shadow-[0_0_10px_rgba(0,0,0,0.1)] backdrop-blur-[0.5px] cursor-grab active:cursor-grabbing"
            />
        </div>
    );
};


const generateGeminiResponse = async (userMessage) => {
    try {
        const dataContext = JSON.stringify(PROJECTS_DATA.map(p => ({
            title: p.title,
            tech: p.tech,
            description: p.description,
            type: p.type
        })));

        const fullPrompt = `${SYSTEM_PROMPT} \n CONTEXT_DATA: ${dataContext} \n\n USER_COMMAND: ${userMessage}`;

        if (!apiKey) {
            await new Promise(r => setTimeout(r, 1000));
            return "AI: API Key missing, but I hear you loud and clear. (Set VITE_GEMINI_API_KEY)";
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: fullPrompt }] }]
                }),
            }
        );

        if (!response.ok) throw new Error("AI Busy");
        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text || "Segmentation fault (core dumped) - just kidding, API error.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Error: Unable to pipe data to neural net.";
    }
};

/* --- COMPONENTS --- */

// Toast Component
const ToastContainer = ({ toasts }) => {
    return (
        <div className="fixed bottom-12 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`
            min-w-[200px] max-w-sm bg-[var(--bg-panel)] border border-[var(--border)] border-l-4 p-3 rounded shadow-xl animate-in slide-in-from-right-full fade-in duration-300
            ${toast.type === 'success' ? 'border-l-emerald-500 text-emerald-100' :
                            toast.type === 'error' ? 'border-l-red-500 text-red-100' :
                                toast.type === 'warning' ? 'border-l-amber-500 text-amber-100' :
                                    'border-l-blue-500 text-blue-100'}
          `}
                >
                    <div className="flex items-center gap-2">
                        {toast.type === 'success' && <CheckCircle size={16} />}
                        {toast.type === 'error' && <AlertCircle size={16} />}
                        {toast.type === 'info' && <Bell size={16} />}
                        <span className="text-xs font-mono">{toast.msg}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Typing Effect
const TypingEffect = ({ text, speed = 50, startDelay = 0 }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setStarted(true), startDelay);
        return () => clearTimeout(timeout);
    }, [startDelay]);

    useEffect(() => {
        if (!started) return;
        let i = 0;
        const interval = setInterval(() => {
            if (i <= text.length) {
                setDisplayedText(text.slice(0, i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed, started]);

    return <span>{displayedText}</span>;
};

const TechTag = ({ label }) => (
    <span className={`px-2 py-0.5 text-[10px] md:text-xs font-mono border rounded ${getTechColorStyles(label)} whitespace-nowrap`}>
        {label}
    </span>
);

const CodeRainBackground = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        const characters = '01';
        const fontSize = 14;
        const columns = width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 12, 0.05)';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#334155'; // Modified to be subtle in any theme, or could use var
            ctx.font = `${fontSize}px monospace`;
            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        };
        const interval = setInterval(draw, 50);
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);
        return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
    }, []);
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};

// Global Custom Scrollbar Styles
const CustomScrollbarStyles = () => (
    <style>{`
    /* Webkit browsers (Chrome, Safari, Edge) */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    ::-webkit-scrollbar-track {
      background: transparent; 
    }
    ::-webkit-scrollbar-thumb {
      background: var(--border); 
      border-radius: 5px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #475569; 
      border: 2px solid transparent;
      background-clip: content-box;
    }
    ::-webkit-scrollbar-corner {
      background: transparent;
    }
    @keyframes blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
.dragging * {
  user-select: none !important;
  cursor: grabbing !important;
}

    /* Firefox */
    * {
      scrollbar-width: thin;
      scrollbar-color: var(--border) transparent;
    }
  `}</style>
);

/* --- SIDEBAR COMPONENTS --- */

const FileTreeItem = ({
    depth = 0,
    name,
    icon: Icon,
    color,
    onClick,
    isActive,
    hasChildren,
    isOpen,
    onToggle,
    onClose,
    showClose,
    draggableId,
    onDragStart
}) => (
    <div
        onMouseDown={(e) => {
            if (!draggableId) return;

            const sx = e.clientX;
            const sy = e.clientY;

            const move = (ev) => {
                if (Math.hypot(ev.clientX - sx, ev.clientY - sy) > 5) {
                    onDragStart?.(ev, draggableId);
                    cleanup();
                }
            };

            const cleanup = () => {
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', cleanup);
            };

            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', cleanup);
        }}

        onClick={(e) => {
            if (hasChildren) {
                onToggle();
            } else {
                onClick?.(e);
            }
        }}
        className={`
    flex items-center py-1 px-3 cursor-pointer select-none transition-colors
    ${isActive
                ? 'bg-[var(--selection)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)]'}
  `}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
    >
        {showClose ? (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose?.();
                }}
                className="w-4 h-4 flex items-center justify-center text-slate-500 hover:text-red-400"
            >
                <X size={10} />
            </button>
        ) : hasChildren ? (
            <div
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                className="p-0.5 hover:bg-[var(--bg-panel)] rounded shrink-0"
            >
                {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </div>
        ) : (
            <span className="w-4 shrink-0" />
        )}

        <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Icon size={14} className={`${color} shrink-0`} />
            <span className="text-xs font-mono truncate min-w-0 flex-1">
                {name}
            </span>
        </div>
    </div>
);

const Sidebar = ({
    onOpenFile,
    onToast,
    onToggleTerminal,
    tabs,
    activeTabId,
    setActiveTabId,
    setTabs,
    editorSettings,
    setEditorSettings
}) => {

    const { theme, setTheme } = useContext(ThemeContext);
    const [activeView, setActiveView] = useState('explorer');
    const [isPanelVisible, setIsPanelVisible] = useState(true);
    const [expandedFolders, setExpandedFolders] = useState({
        'src': true,
        'components': false,
        'pages': true,
        'projects': false,
        'recruiter': true
    });
    const [isExplorerMenuOpen, setIsExplorerMenuOpen] = useState(false);
    const explorerMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (explorerMenuRef.current && !explorerMenuRef.current.contains(e.target)) {
                setIsExplorerMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [stagedFiles, setStagedFiles] = useState(['resume_old.pdf', 'resume_new.pdf']);
    const [installedExtensions, setInstalledExtensions] = useState({
        "React IntelliSense": true,
        "TypeScript Importer": true,
        "Tailwind CSS": true,
        "Go Tools": false,
        "Python": false,
        "Motivation.js": false
    });


    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsPanelVisible(false);
        }
    }, []);

    const handleActivityClick = (view) => {
        if (activeView === view) {
            setIsPanelVisible(!isPanelVisible);
        } else {
            setActiveView(view);
            setIsPanelVisible(true);
        }
    };

    const toggleFolder = (folder) => {
        setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
    };

    const toggleExtension = (name) => {
        if (!installedExtensions[name]) {
            onToast(`Downloading ${name} package...`, 'info');
            setTimeout(() => onToast(`${name} installed successfully!`, 'success'), 1500);
        } else {
            onToast(`Uninstalling ${name}...`, 'warning');
        }
        setInstalledExtensions(prev => ({ ...prev, [name]: !prev[name] }));
        setTimeout(() => {
            fireMotivation();
        }, 300);
    };

    const motivationQuotes = [
        "This worked yesterday. You didn't change anything. Right?",
        "You've been debugging for 2 hours. Skill issue.",
        "Senior dev moment detected.",
        "Trust the process. Or don't.",
        "It compiles. Ship it."
    ];

    const fireMotivation = () => {
        if (!installedExtensions["Motivation.js"]) return;
        const quote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
        onToast(quote, "info");
    };

    const toggleSetting = (key) => {
        if (key === "Minimap") {
            setEditorSettings(prev => ({
                ...prev,
                minimap: !prev.minimap
            }));
            onToast(`Minimap ${editorSettings.minimap ? "disabled" : "enabled"}`, "info");
            return;
        }

        if (key === "Word Wrap") {
            setEditorSettings(prev => ({
                ...prev,
                wordWrap: !prev.wordWrap
            }));
            onToast(`Word wrap ${editorSettings.wordWrap ? "disabled" : "enabled"}`, "info");
            return;
        }
    };


    const stageFile = (file) => {
        setStagedFiles(prev => prev.filter(f => f !== file));
        onToast(`Staged ${file}`, 'info');
    };

    const handleCommit = () => {
        if (stagedFiles.length === 0) {
            onToast("Nothing to commit. Work harder.", "warning");
            return;
        }
        onToast("Commit sent to main... Production deploying.", "success");
    };

    const handleSignOut = () => {
        onToast("Disconnecting from matrix...", "error");
        setTimeout(() => onToast("Error: You are the One. Cannot leave.", "warning"), 2000);
    };

    const handleEditProfile = () => {
        onToast("Accessing encrypted user data...", "info");
    };

    const filteredProjects = PROJECTS_DATA.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full border-r border-[var(--border)] bg-[var(--bg-activity)] z-30 relative shrink-0 transition-colors duration-300">

            {/* ACTIVITY BAR */}
            <div className="w-12 flex flex-col items-center py-4 border-r border-[var(--border)] bg-[var(--bg-activity)] gap-6 z-30 relative transition-colors duration-300">
                <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'explorer' && isPanelVisible ? 'text-[var(--text-primary)] border-l-2 border-[var(--accent)] bg-[var(--bg-panel)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} onClick={() => handleActivityClick('explorer')} title="Explorer"><FileCode size={20} /></div>
                <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'search' && isPanelVisible ? 'text-[var(--text-primary)] border-l-2 border-[var(--accent)] bg-[var(--bg-panel)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} onClick={() => handleActivityClick('search')} title="Search"><Search size={20} /></div>
                <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'git' && isPanelVisible ? 'text-[var(--text-primary)] border-l-2 border-[var(--accent)] bg-[var(--bg-panel)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} onClick={() => handleActivityClick('git')} title="Source Control"><GitBranch size={20} /></div>
                <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'extensions' && isPanelVisible ? 'text-[var(--text-primary)] border-l-2 border-[var(--accent)] bg-[var(--bg-panel)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} onClick={() => handleActivityClick('extensions')} title="Extensions"><Box size={20} /></div>
                <div className="mt-auto flex flex-col gap-6">
                    <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'account' && isPanelVisible ? 'text-[var(--text-primary)] border-l-2 border-[var(--accent)] bg-[var(--bg-panel)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} onClick={() => handleActivityClick('account')} title="Account"><User size={20} /></div>
                    <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'settings' && isPanelVisible ? 'text-[var(--text-primary)] border-l-2 border-[var(--accent)] bg-[var(--bg-panel)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} onClick={() => handleActivityClick('settings')} title="Settings"><Settings size={20} /></div>
                </div>
            </div>

            {/* Mobile backdrop */}
            {isPanelVisible && (
                <div
                    className="fixed inset-0 z-10 bg-black/40 md:hidden"
                    onClick={() => setIsPanelVisible(false)}
                />
            )}

            {/* SIDEBAR PANEL CONTENT */}
            <div className={`
        flex flex-col bg-[var(--bg-main)] border-r border-[var(--border)]
        fixed md:relative top-0 bottom-0 left-12 md:left-0 z-20
        w-60 transition-transform duration-300 ease-in-out
        ${isPanelVisible ? 'translate-x-0' : '-translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden md:border-none'}
      `}>

                {/* EXPLORER VIEW */}
                {activeView === 'explorer' && (
                    <div className="flex-1 flex flex-col min-h-0 min-w-[15rem]">
                        <div className="h-9 px-4 flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] tracking-wider">
                            <span>EXPLORER</span>
                            <div className="flex gap-2">
                                <div className="relative" ref={explorerMenuRef}>
                                    <MoreHorizontalIcon
                                        size={14}
                                        className="hover:text-[var(--text-primary)] cursor-pointer"
                                        onClick={() => setIsExplorerMenuOpen(v => !v)}
                                    />
                                    {isExplorerMenuOpen && (
                                        <div className="absolute right-0 top-6 w-40 bg-[var(--bg-panel)] border border-[var(--border)] rounded shadow-xl z-50">
                                            <button
                                                onClick={() => {
                                                    onToggleTerminal();
                                                    setIsExplorerMenuOpen(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-xs font-mono text-[var(--text-primary)] hover:bg-[var(--bg-activity)]"
                                            >
                                                Open Terminal
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                            {/* OPEN EDITORS */}
                            <div className="mb-2">
                                <div className="px-4 text-xs font-bold text-[var(--text-secondary)] mb-1">
                                    OPEN EDITORS
                                </div>
                                {tabs.map(tab => {
                                    const { icon, color } = getFileIcon(tab.title);
                                    return (
                                        <FileTreeItem
                                            key={tab.id}
                                            depth={0}
                                            name={tab.title}
                                            icon={icon}
                                            color={color}
                                            isActive={tab.id === activeTabId}
                                            onClick={() => setActiveTabId(tab.id)}
                                            showClose={tab.id !== 'home'}
                                            onClose={() => {
                                                if (tab.id === 'home') return;
                                                setActiveTabId(prev => prev === tab.id ? 'home' : prev);
                                                setTabs(prev => prev.filter(t => t.id !== tab.id));
                                            }}
                                        />
                                    );
                                })}
                            </div>

                            <div className="px-4 mb-2 flex items-center gap-1 text-indigo-400 font-bold text-xs"><ChevronDown size={12} /> <span>PORTFOLIO</span></div>

                            {/* SRC Folder */}
                            <FileTreeItem
                                depth={0} name="src" icon={expandedFolders['src'] ? FolderOpen : Folder} color="text-indigo-400"
                                hasChildren isOpen={expandedFolders['src']} onToggle={() => toggleFolder('src')}
                            />

                            {expandedFolders['src'] && (
                                <>
                                    {/* Projects Folder */}
                                    <FileTreeItem
                                        depth={1} name="projects" icon={expandedFolders['projects'] ? FolderOpen : Folder} color="text-emerald-400"
                                        hasChildren isOpen={expandedFolders['projects']} onToggle={() => toggleFolder('projects')}
                                    />
                                    {expandedFolders['projects'] && PROJECTS_DATA.map(p => {
                                        const fileName = `${p.title}.tsx`;
                                        const fileMeta = getFileIcon(fileName);
                                        return (
                                            <FileTreeItem
                                                key={p.id}
                                                depth={2}
                                                name={fileName}
                                                icon={fileMeta.icon}
                                                color={fileMeta.color}

                                                draggableId={p.id}

                                                onDragStart={(e, id) => {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: {
                                                                id,
                                                                file: {
                                                                    id: p.id,
                                                                    title: fileName,
                                                                    type: 'detail',
                                                                    data: p
                                                                }
                                                            }
                                                        })
                                                    );
                                                }}

                                                onClick={() => onOpenFile({
                                                    id: p.id,
                                                    title: fileName,
                                                    type: 'detail',
                                                    data: p
                                                })}
                                            />

                                        );
                                    })}

                                    {/* Pages Folder */}
                                    <FileTreeItem
                                        depth={1} name="pages" icon={expandedFolders['pages'] ? FolderOpen : Folder} color="text-amber-400"
                                        hasChildren isOpen={expandedFolders['pages']} onToggle={() => toggleFolder('pages')}
                                    />
                                    {expandedFolders['pages'] && (
                                        <>
                                            {[
                                                { name: "home.tsx", type: "home" },
                                                { name: "projects.tsx", type: "projects" },
                                            ].map(f => {
                                                const meta = getFileIcon(f.name);
                                                return (
                                                    <FileTreeItem
                                                        key={f.name}
                                                        depth={2}
                                                        name={f.name}
                                                        icon={meta.icon}
                                                        color={meta.color}

                                                        draggableId={f.name}

                                                        onDragStart={(e, id) => {
                                                            window.dispatchEvent(
                                                                new CustomEvent("explorer-drag-start", {
                                                                    detail: {
                                                                        id,
                                                                        file: {
                                                                            id: f.name,
                                                                            title: f.name,
                                                                            type: f.type
                                                                        }
                                                                    }
                                                                })
                                                            );
                                                        }}

                                                        onClick={() =>
                                                            onOpenFile({
                                                                id: f.name,
                                                                title: f.name,
                                                                type: f.type
                                                            })
                                                        }
                                                    />

                                                )
                                            })}
                                            {/* Projects JSON */}
                                            <FileTreeItem
                                                depth={2}
                                                name="projects.json"
                                                icon={getFileIcon("projects.json").icon}
                                                color={getFileIcon("projects.json").color}

                                                draggableId="projects_json"

                                                onDragStart={(e, id) => {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: {
                                                                id,
                                                                file: {
                                                                    id: "projects_json",
                                                                    title: "projects.json",
                                                                    type: "code",
                                                                    content: FILE_CONTENTS.projects_json,
                                                                    lang: "json"
                                                                }
                                                            }
                                                        })
                                                    );
                                                }}

                                                onClick={() =>
                                                    onOpenFile({
                                                        id: "projects_json",
                                                        title: "projects.json",
                                                        type: "code",
                                                        content: FILE_CONTENTS.projects_json,
                                                        lang: "json"
                                                    })
                                                }
                                            />

                                        </>
                                    )}

                                    {/* Components Folder */}
                                    <FileTreeItem
                                        depth={1} name="components" icon={expandedFolders['components'] ? FolderOpen : Folder} color="text-emerald-400"
                                        hasChildren isOpen={expandedFolders['components']} onToggle={() => toggleFolder('components')}
                                    />
                                    {expandedFolders['components'] && (
                                        <>
                                            <FileTreeItem
                                                depth={2}
                                                name="Terminal.tsx"
                                                icon={getFileIcon("Terminal.tsx").icon}
                                                color={getFileIcon("Terminal.tsx").color}

                                                draggableId="terminal_comp"

                                                onDragStart={(e, id) => {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: {
                                                                id,
                                                                file: {
                                                                    id: "terminal_comp",
                                                                    title: "Terminal.tsx",
                                                                    type: "code",
                                                                    content: FILE_CONTENTS.terminal_component,
                                                                    lang: "typescript"
                                                                }
                                                            }
                                                        })
                                                    );
                                                }}

                                                onClick={() =>
                                                    onOpenFile({
                                                        id: "terminal_comp",
                                                        title: "Terminal.tsx",
                                                        type: "code",
                                                        content: FILE_CONTENTS.terminal_component,
                                                        lang: "typescript"
                                                    })
                                                }
                                            />

                                            <FileTreeItem
                                                depth={2}
                                                name="Window.tsx"
                                                icon={getFileIcon("Window.tsx").icon}
                                                color={getFileIcon("Window.tsx").color}

                                                draggableId="window_comp"

                                                onDragStart={(e, id) => {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: {
                                                                id,
                                                                file: {
                                                                    id: "window_comp",
                                                                    title: "Window.tsx",
                                                                    type: "code",
                                                                    content: FILE_CONTENTS.window_component,
                                                                    lang: "typescript"
                                                                }
                                                            }
                                                        })
                                                    );
                                                }}

                                                onClick={() =>
                                                    onOpenFile({
                                                        id: "window_comp",
                                                        title: "Window.tsx",
                                                        type: "code",
                                                        content: FILE_CONTENTS.window_component,
                                                        lang: "typescript"
                                                    })
                                                }
                                            />

                                            <FileTreeItem
                                                depth={2}
                                                name="word_wrap_from_hell.json"
                                                icon={getFileIcon("word_wrap_from_hell.json").icon}
                                                color={getFileIcon("word_wrap_from_hell.json").color}

                                                draggableId="word_wrap_from_hell"

                                                onDragStart={(e, id) => {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: {
                                                                id,
                                                                file: {
                                                                    id,
                                                                    title: "components/word_wrap_from_hell.json",
                                                                    type: "code",
                                                                    content: FILE_CONTENTS.word_wrap_from_hell,
                                                                    lang: "json"
                                                                }
                                                            }
                                                        })
                                                    );
                                                }}

                                                onClick={() =>
                                                    onOpenFile({
                                                        id: "word_wrap_from_hell",
                                                        title: "components/word_wrap_from_hell.json",
                                                        type: "code",
                                                        content: FILE_CONTENTS.word_wrap_from_hell,
                                                        lang: "json"
                                                    })
                                                }
                                            />


                                            <FileTreeItem
                                                depth={2}
                                                name="minimap_stress_test.json"
                                                icon={getFileIcon("minimap_stress_test.json").icon}
                                                color={getFileIcon("minimap_stress_test.json").color}

                                                draggableId="minimap_stress_test"

                                                onDragStart={(e, id) => {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: {
                                                                id,
                                                                file: {
                                                                    id: "minimap_stress_test",
                                                                    title: "components/minimap_stress_test.json",
                                                                    type: "code",
                                                                    content: FILE_CONTENTS.minimap_stress_test,
                                                                    lang: "json"
                                                                }
                                                            }
                                                        })
                                                    );
                                                }}

                                                onClick={() =>
                                                    onOpenFile({
                                                        id: "minimap_stress_test",
                                                        title: "components/minimap_stress_test.json",
                                                        type: "code",
                                                        content: FILE_CONTENTS.minimap_stress_test,
                                                        lang: "json"
                                                    })
                                                }
                                            />


                                        </>
                                    )}
                                </>
                            )}

                            {/* Root Files */}
                            {[
                                { name: ".env", type: 'code', content: FILE_CONTENTS.env, lang: 'bash' },
                                { name: ".gitignore", type: 'code', content: FILE_CONTENTS.gitignore, lang: 'bash' },
                                {
                                    name: "package.json",
                                    type: "code",
                                    content: FILE_CONTENTS.package_json,
                                    lang: "json"
                                },


                                {
                                    name: "README.md",
                                    type: 'readme',
                                    content: FILE_CONTENTS.readme // ← add this
                                }
                            ].map(f => {
                                const fileMeta = getFileIcon(f.name);
                                return (
                                    <FileTreeItem
                                        key={f.name}
                                        depth={0}
                                        name={f.name}
                                        icon={fileMeta.icon}
                                        color={fileMeta.color}

                                        draggableId={f.name}

                                        onDragStart={(e, id) => {
                                            window.dispatchEvent(
                                                new CustomEvent("explorer-drag-start", {
                                                    detail: {
                                                        id,
                                                        file: {
                                                            id: f.name,
                                                            title: f.name,
                                                            type: f.type,
                                                            content: f.content,
                                                            lang: f.lang
                                                        }
                                                    }
                                                })
                                            );
                                        }}

                                        onClick={() =>
                                            onOpenFile({
                                                id: f.name,
                                                title: f.name,
                                                type: f.type,
                                                content: f.content,
                                                lang: f.lang
                                            })
                                        }
                                    />

                                );
                            })}

                            {/* Recruiter Folder */}
                            <FileTreeItem
                                depth={0}
                                name="recruiter"
                                icon={expandedFolders['recruiter'] ? FolderOpen : Folder}
                                color="text-emerald-400"
                                hasChildren
                                isOpen={expandedFolders['recruiter']}
                                onToggle={() => toggleFolder('recruiter')}
                            />
                            {expandedFolders['recruiter'] && (
                                <>
                                    {[
                                        { name: "hire_me.json", content: FILE_CONTENTS.hire_me, lang: 'json' },
                                        { name: "skills.json", content: FILE_CONTENTS.skills_json, lang: 'json' },
                                        { name: "career_path.txt", content: FILE_CONTENTS.career_path, lang: 'text' }
                                    ].map(f => {
                                        const fileMeta = getFileIcon(f.name);
                                        return (
                                            <FileTreeItem
                                                key={f.name}
                                                depth={1}
                                                name={f.name}
                                                icon={fileMeta.icon}
                                                color={fileMeta.color}

                                                draggableId={`recruiter_${f.name}`}

                                                onDragStart={(e, id) => {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: {
                                                                id,
                                                                file: {
                                                                    id: `recruiter_${f.name}`,
                                                                    title: `recruiter/${f.name}`,
                                                                    type: "code",
                                                                    content: f.content,
                                                                    lang: f.lang
                                                                }
                                                            }
                                                        })
                                                    );
                                                }}

                                                onClick={() =>
                                                    onOpenFile({
                                                        id: `recruiter_${f.name}`,
                                                        title: `recruiter/${f.name}`,
                                                        type: "code",
                                                        content: f.content,
                                                        lang: f.lang
                                                    })
                                                }
                                            />

                                        );
                                    })}
                                </>
                            )}

                        </div>
                    </div>
                )}

                {/* SEARCH VIEW */}
                {activeView === 'search' && (
                    <div className="flex-1 flex flex-col p-4 min-w-[15rem]">
                        <div className="text-xs font-bold text-[var(--text-secondary)] mb-4 tracking-wider">SEARCH</div>
                        <div className="relative mb-4">
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search projects..."
                                className="w-full bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-xs p-2 pl-8 rounded focus:outline-none focus:border-indigo-500"
                            />
                            <Search size={12} className="absolute left-2.5 top-2.5 text-slate-500" />
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {searchQuery && filteredProjects.map(p => (
                                <div key={p.id} onClick={() => onOpenFile({ id: p.id, title: `${p.title}.tsx`, type: 'detail', data: p })} className="group cursor-pointer mb-3 hover:bg-[var(--bg-activity)] p-2 rounded">
                                    <div className="flex items-center gap-2 text-xs text-[var(--text-primary)] group-hover:text-indigo-400 font-mono mb-1">
                                        {(() => {
                                            const { icon: Icon, color } = getFileIcon(`${p.title}.tsx`);
                                            return <Icon size={12} className={color} />;
                                        })()}
                                        {p.title}.tsx
                                    </div>
                                    <div className="text-[10px] text-[var(--text-secondary)] pl-5 line-clamp-2">{p.description}</div>
                                </div>
                            ))}
                            {searchQuery && filteredProjects.length === 0 && <div className="text-xs text-[var(--text-secondary)] text-center mt-4">No results found.</div>}
                            {!searchQuery && <div className="text-xs text-[var(--text-secondary)] text-center mt-10">Type to search across all files and projects.</div>}
                        </div>
                    </div>
                )}

                {/* GIT VIEW */}
                {activeView === 'git' && (
                    <div className="flex-1 flex flex-col p-4 min-w-[15rem]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-xs font-bold text-[var(--text-secondary)] tracking-wider">SOURCE CONTROL</div>
                            <div className="flex gap-2">
                                <div className="text-[var(--text-secondary)] hover:text-white cursor-pointer"><RefreshCw size={12} /></div>
                            </div>
                        </div>
                        <div className="text-xs text-[var(--text-primary)] font-mono mb-2 flex items-center gap-2">
                            <ChevronDown size={12} /> <span>Changes</span> <span className="bg-[var(--bg-activity)] px-1.5 rounded-full text-[10px]">{stagedFiles.length}</span>
                        </div>
                        <div className="space-y-1">
                            {stagedFiles.map(file => (
                                <div key={file} className="flex items-center gap-2 py-1 px-2 hover:bg-[var(--bg-activity)] rounded cursor-pointer group">
                                    <FileText size={14} className="text-yellow-500" />
                                    <span className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{file}</span>
                                    <span onClick={() => stageFile(file)} className="text-[10px] text-[var(--text-secondary)] hover:text-green-400 ml-auto flex items-center gap-1">
                                        <Plus size={10} />
                                    </span>
                                </div>
                            ))}
                            {stagedFiles.length === 0 && <div className="text-xs text-[var(--text-secondary)] italic pl-2">All changes staged.</div>}
                        </div>
                        <div className="mt-6">
                            <input placeholder="Message (Ctrl+Enter)" className="w-full bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-xs p-2 rounded focus:outline-none focus:border-indigo-500" />
                            <button
                                onClick={handleCommit}
                                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-1.5 rounded flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={12} /> Commit
                            </button>
                        </div>
                    </div>
                )}

                {/* EXTENSIONS VIEW */}
                {activeView === 'extensions' && (
                    <div className="flex-1 flex flex-col p-4 min-w-[15rem]">
                        <div className="text-xs font-bold text-[var(--text-secondary)] mb-4 tracking-wider">EXTENSIONS</div>
                        <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
                            {Object.entries(installedExtensions).map(([name, installed], i) => (
                                <div key={i} className="flex gap-3 hover:bg-[var(--bg-activity)] p-2 rounded cursor-default group">
                                    <div className="w-8 h-8 bg-indigo-900/50 text-indigo-400 flex items-center justify-center rounded shrink-0">
                                        <Box size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="text-xs font-bold text-[var(--text-primary)] truncate">{name}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleExtension(name)}
                                                className={`text-[9px] px-1.5 py-0.5 rounded border ${installed ? 'bg-[var(--bg-activity)] border-[var(--border)] text-[var(--text-secondary)]' : 'bg-indigo-600 border-indigo-500 text-white'}`}
                                            >
                                                {installed ? 'Uninstall' : 'Install'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SETTINGS VIEW */}
                {activeView === 'settings' && (
                    <div className="flex-1 flex flex-col p-4 min-w-[15rem]">
                        <div className="text-xs font-bold text-[var(--text-secondary)] mb-4 tracking-wider">SETTINGS</div>
                        <div className="space-y-4 mb-6">
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-primary)]">Word Wrap</span>
                                    <button onClick={() => toggleSetting("Word Wrap")}>
                                        {editorSettings.wordWrap
                                            ? <ToggleRight size={24} className="text-indigo-400" />
                                            : <ToggleLeft size={24} />}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-primary)]">Minimap</span>
                                    <button onClick={() => toggleSetting("Minimap")}>
                                        {editorSettings.minimap
                                            ? <ToggleRight size={24} className="text-indigo-400" />
                                            : <ToggleLeft size={24} />}
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* THEME ENGINE SELECTOR */}
                        <div className="pt-4 border-t border-[var(--border)]">
                            <div className="text-xs font-bold text-[var(--text-secondary)] mb-3 tracking-wider flex items-center gap-2">
                                <Palette size={12} /> THEME
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {Object.entries(THEMES).map(([key, themeData]) => (
                                    <button
                                        key={key}
                                        onClick={() => setTheme(key)}
                                        className={`flex items-center gap-3 px-3 py-2 rounded border transition-all text-xs font-mono
                      ${theme === key
                                                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                                                : 'bg-[var(--bg-activity)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'}
                    `}
                                    >
                                        <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: themeData.colors['--bg-main'] }}></div>
                                        {themeData.name}
                                        {theme === key && <CheckCircle size={10} className="ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-[var(--border)]">
                            <button className="text-xs text-[var(--text-secondary)] hover:text-white flex items-center gap-2 mb-3">
                                <FileJson size={14} /> Open settings.json
                            </button>
                        </div>
                    </div>
                )}

                {/* ACCOUNT VIEW */}
                {activeView === 'account' && (
                    <div className="flex-1 flex flex-col p-6 items-center text-center min-w-[15rem]">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white mb-4">
                            A
                        </div>
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">Arnav</h3>
                        <p className="text-xs text-[var(--text-secondary)] mb-6">Full Stack Engineer</p>

                        <div className="w-full space-y-2">
                            <button onClick={handleEditProfile} className="w-full py-1.5 text-xs bg-[var(--bg-activity)] hover:bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border)] rounded">Edit Profile</button>
                            <button onClick={handleSignOut} className="w-full py-1.5 text-xs bg-[var(--bg-activity)] hover:bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border)] rounded">Sign Out</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

/* --- INTEGRATED TERMINAL --- */
const IntegratedTerminal = ({ isOpen, onClose, onOpenFile }) => {
    const [history, setHistory] = useState([
        { type: 'system', content: 'Shell v2.5.0' },
        { type: 'system', content: 'Type "help" for commands or just ask a question.' },
    ]);
    const [input, setInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [history]);

    useEffect(() => {
        if (!isProcessing && isOpen) {
            const t = setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
            return () => clearTimeout(t);
        }
    }, [isProcessing, isOpen]);


    const handleCommand = async () => {
        const cmd = input.trim();
        if (!cmd) return;

        setHistory(prev => [...prev, { type: 'user', content: cmd }]);
        setInput("");

        const args = cmd.split(' ');
        const command = args[0].toLowerCase();

        if (command === 'help') {
            setTimeout(() => {
                setHistory(prev => [...prev, {
                    type: 'output', content:
                        `Available Commands:
  ls              List all projects
  open <name>     Open project details
  cat <name>       Print project summary
  clear            Clear terminal history
  whoami           Print current user info
  <query>          Ask Gemini AI anything`
                }]);
                setIsProcessing(false);
            }, 100);
            return;
        }

        if (command === 'ls' || command === 'list') {
            const list = PROJECTS_DATA.map(p =>
                `${p.id.padEnd(20)} ${p.type.padEnd(15)} ${p.date}`
            ).join('\n');

            setTimeout(() => {
                setHistory(prev => [...prev, { type: 'output', content: list }]);
                setIsProcessing(false);
            }, 100);
            return;
        }

        if (command === 'clear') {
            setHistory([]);
            setIsProcessing(false);
            return;
        }

        if (command === 'open') {
            const target = args[1];
            const project = PROJECTS_DATA.find(p => p.id === target || p.title === target);
            if (project) {
                setHistory(prev => [...prev, { type: 'success', content: `Opening ${project.title}...` }]);
                onOpenFile({ id: project.id, title: `${project.title}.tsx`, type: 'detail', data: project });
            } else {
                setHistory(prev => [...prev, { type: 'error', content: `Error: Project '${target}' not found.` }]);
            }
            setIsProcessing(false);
            return;
        }

        if (command === 'cat') {
            const target = args[1];
            const project = PROJECTS_DATA.find(p => p.id === target || p.title === target);
            if (project) {
                setHistory(prev => [...prev, { type: 'output', content: `\n--- ${project.title.toUpperCase()} ---\n${project.description}\nStack: ${project.tech.join(', ')}\n` }]);
            } else {
                setHistory(prev => [...prev, { type: 'error', content: `Error: Project '${target}' not found.` }]);
            }
            setIsProcessing(false);
            return;
        }

        try {
            setIsProcessing(true);
            const thinkingId = Date.now();
            setHistory(prev => [
                ...prev,
                { id: thinkingId, type: 'system', content: 'gemini: thinking' }
            ]);

            let frame = 0;
            const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

            const thinkingInterval = setInterval(() => {
                frame = (frame + 1) % frames.length;
                setHistory(prev =>
                    prev.map(line =>
                        line.id === thinkingId
                            ? { ...line, content: `gemini: ${frames[frame]} thinking` }
                            : line
                    )
                );
            }, 120);

            const aiResponse = await generateGeminiResponse(cmd);
            const delay = 800 + Math.random() * 800;

            setTimeout(() => {
                clearInterval(thinkingInterval);
                setHistory(prev => [
                    ...prev.filter(line => line.id !== thinkingId),
                    { type: 'output', content: aiResponse }
                ]);
                setIsProcessing(false);
            }, delay);
            return;
        } catch (e) {
            setHistory(prev => [...prev, { type: 'error', content: "Error connecting to AI." }]);
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-[40vh] md:h-80 bg-[var(--bg-main)] border-t border-[var(--border)] z-50 flex flex-col shadow-[0_-5px_20px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-300">
            <div className="h-8 bg-[var(--bg-activity)] border-b border-[var(--border)] flex justify-between items-center px-4 select-none flex-shrink-0">
                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-mono">
                    <Terminal size={12} />
                    <span>TERMINAL</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] text-[var(--text-secondary)] font-mono hidden md:inline">Node v20.1.0</span>
                    <button onClick={onClose} className="hover:text-white text-[var(--text-secondary)] transition-colors">
                        <Minimize2 size={14} />
                    </button>
                    <button onClick={onClose} className="hover:text-red-400 text-[var(--text-secondary)] transition-colors">
                        <X size={14} />
                    </button>
                </div>
            </div>
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-xs md:text-sm bg-[var(--bg-main)] scrollbar-thin scrollbar-thumb-slate-700 custom-scrollbar"
                onClick={() => {
                    if (!isProcessing) inputRef.current?.focus();
                }}
            >
                {history.map((line, i) => (
                    <div key={i} className="mb-1 whitespace-pre-wrap break-words">
                        {line.type === 'user' && (
                            <div className="flex gap-2 text-[var(--text-primary)]">
                                <span className="text-emerald-500">➜</span>
                                <span className="text-blue-400">~</span>
                                <span>{line.content}</span>
                            </div>
                        )}
                        {line.type === 'system' && <div className="text-[var(--text-secondary)] italic">{line.content}</div>}
                        {line.type === 'output' && <div className="text-[var(--text-primary)] ml-4">{line.content}</div>}
                        {line.type === 'success' && <div className="text-emerald-400 ml-4">{line.content}</div>}
                        {line.type === 'error' && <div className="text-red-400 ml-4">{line.content}</div>}
                    </div>
                ))}
                <div className="flex gap-2 items-center mt-2">
                    <span className="text-emerald-500">➜</span>
                    <span className="text-blue-400">~</span>
                    <div className="relative flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            disabled={isProcessing}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !isProcessing) {
                                    e.preventDefault();
                                    handleCommand();
                                }
                            }}
                            className={`w-full bg-transparent border-none outline-none ${isProcessing ? 'text-[var(--text-secondary)] cursor-wait' : 'text-[var(--text-primary)]'}`}
                        />
                        {isProcessing && (
                            <div className="absolute top-0 right-0">
                                <div className="h-4 w-2 bg-[var(--text-secondary)] animate-pulse" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* --- COMMAND PALETTE (VSCODE FEATURE) --- */
const CommandPalette = ({ isOpen, onClose, onOpenFile }) => {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    // Generate a flat list of all openable items
    const allItems = useMemo(() => {
        const items = [];
        items.push({
            id: 'open_terminal',
            title: 'Open Terminal',
            type: 'command',
            icon: Terminal,
            action: 'open_terminal'
        });

        // Pages
        items.push({ id: 'home', title: 'home.tsx', type: 'home', icon: FileCode, path: 'src/pages/home.tsx' });
        items.push({ id: 'projects_tsx', title: 'projects.tsx', type: 'projects', icon: FileCode, path: 'src/pages/projects.tsx' });

        // Projects
        PROJECTS_DATA.forEach(p => {
            items.push({ id: p.id, title: `${p.title}.tsx`, type: 'detail', data: p, icon: FileCode, path: `src/projects/${p.title}.tsx` });
        });
        Object.entries(THEMES).forEach(([key, theme]) => {
            items.push({
                id: `theme_${key}`,
                title: `Theme: ${theme.name}`,
                type: 'command',
                action: 'set_theme',
                themeKey: key,
                icon: Palette,
                path: 'Preferences / Theme'
            });
        });
        // --- INSERT THIS BLOCK ---
        items.push({
            id: 'toggle_minimap',
            title: 'View: Toggle Minimap',
            type: 'command',
            action: 'toggle_setting',
            settingKey: 'minimap',
            icon: ToggleLeft,
            path: 'Preferences'
        });
        items.push({
            id: 'toggle_wordwrap',
            title: 'View: Toggle Word Wrap',
            type: 'command',
            action: 'toggle_setting',
            settingKey: 'wordWrap',
            icon: FileText,
            path: 'Preferences'
        });
        // Config files
        items.push({ id: 'env', title: '.env', type: 'code', content: FILE_CONTENTS.env, lang: 'bash', icon: Lock, path: '.env' });
        items.push({ id: 'gitignore', title: '.gitignore', type: 'code', content: FILE_CONTENTS.gitignore, lang: 'bash', icon: GitBranch, path: '.gitignore' });
        items.push({ id: 'package', title: 'package.json', type: 'package', icon: Box, path: 'package.json' });
        items.push({ id: 'readme', title: 'README.md', type: 'readme', icon: FileText, path: 'README.md' });
        items.push({ id: 'projects_json', title: 'projects.json', type: 'code', content: FILE_CONTENTS.projects_json, lang: 'json', icon: FileJson, path: 'src/projects.json' });
        items.push({
            id: 'word_wrap_from_hell',
            title: 'word_wrap_from_hell.json',
            type: 'code',
            content: FILE_CONTENTS.word_wrap_from_hell,
            lang: 'json',
            icon: FileJson,
            path: 'word_wrap_from_hell.json'
        });
        items.push({
            id: "minimap_stress_test",
            title: "minimap_stress_test.json",
            type: "code",
            content: FILE_CONTENTS.minimap_stress_test,
            lang: "json",
            icon: FileJson,
            path: "minimap_stress_test.json"
        }
        );

        // Components
        items.push({ id: 'terminal_comp', title: 'Terminal.tsx', type: 'code', content: FILE_CONTENTS.terminal_component, lang: 'typescript', icon: FileCode, path: 'src/components/Terminal.tsx' });
        items.push({ id: 'window_comp', title: 'Window.tsx', type: 'code', content: FILE_CONTENTS.window_component, lang: 'typescript', icon: FileCode, path: 'src/components/Window.tsx' });

        // Recruiter
        items.push({ id: 'hire_me', title: 'hire_me.json', type: 'code', content: FILE_CONTENTS.hire_me, lang: 'json', icon: FileJson, path: 'recruiter/hire_me.json' });
        items.push({ id: 'skills', title: 'skills.json', type: 'code', content: FILE_CONTENTS.skills_json, lang: 'json', icon: FileJson, path: 'recruiter/skills.json' });

        return items;
    }, []);

    const filteredItems = useMemo(() => {
        if (!query) return allItems;
        const lowerQ = query.toLowerCase();
        return allItems.filter(item =>
            item.title.toLowerCase().includes(lowerQ) ||
            item.path?.toLowerCase().includes(lowerQ)
        );
    }, [query, allItems]);


    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery("");
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredItems.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const item = filteredItems[selectedIndex];
            if (!item) return;

            if (item.type === 'command') {
                if (item.action === 'open_terminal') {
                    window.dispatchEvent(new CustomEvent('open-terminal'));
                    onClose();
                    return;
                }

                if (item.action === 'set_theme') {
                    window.dispatchEvent(
                        new CustomEvent('set-theme', { detail: item.themeKey })
                    );
                    onClose();
                    return;
                }
                if (item.action === 'toggle_setting') {
                    window.dispatchEvent(
                        new CustomEvent('toggle-setting', { detail: item.settingKey })
                    );
                    onClose();
                    return;
                }
            }


            onOpenFile(item);
            onClose();
        }
        else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex justify-center pt-[10vh]" onClick={onClose}>
            <div
                className="w-[600px] max-w-[90vw] bg-[var(--bg-panel)] border border-[var(--border)] shadow-2xl rounded-lg overflow-hidden flex flex-col h-[400px]"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-3 border-b border-[var(--border)] flex items-center gap-3">
                    <SearchIcon size={16} className="text-[var(--text-secondary)]" />
                    <input
                        ref={inputRef}
                        className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] text-sm font-mono placeholder-[var(--text-secondary)]"
                        placeholder="Search files by name..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="text-[10px] bg-[var(--bg-activity)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded border border-[var(--border)]">ESC</div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                    {filteredItems.length === 0 && (
                        <div className="text-center text-[var(--text-secondary)] text-xs mt-4">No matching results</div>
                    )}
                    {filteredItems.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                if (item.type === 'command') {
                                    if (item.action === 'open_terminal') {
                                        window.dispatchEvent(new CustomEvent('open-terminal'));
                                        onClose();
                                        return;
                                    }

                                    if (item.action === 'set_theme') {
                                        window.dispatchEvent(
                                            new CustomEvent('set-theme', { detail: item.themeKey })
                                        );
                                        onClose();
                                        return;
                                    }
                                    if (item.action === 'toggle_setting') {
                                        window.dispatchEvent(
                                            new CustomEvent('toggle-setting', { detail: item.settingKey })
                                        );
                                        onClose();
                                        return;
                                    }
                                }


                                onOpenFile(item);
                                onClose();
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer group ${idx === selectedIndex ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-primary)] hover:bg-[var(--bg-activity)]'}`}
                        >
                            <item.icon size={14} className={idx === selectedIndex ? 'text-white' : 'text-[var(--text-secondary)]'} />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-mono truncate">{item.title}</div>
                                <div className={`text-[10px] truncate ${idx === selectedIndex ? 'text-white/70' : 'text-[var(--text-secondary)]'}`}>{item.path}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-1 bg-[var(--bg-main)] border-t border-[var(--border)] text-[10px] text-[var(--text-secondary)] text-right px-3">
                    Portfolio Command Palette
                </div>
            </div>
        </div>
    );
};

/* --- BREADCRUMBS COMPONENT --- */
const Breadcrumbs = ({ path }) => {
    if (!path) return null;
    const parts = path.split('/');

    return (
        <div
            className="
      sticky top-0 z-20
      flex items-center gap-1
      text-[10px] text-[var(--text-secondary)]
      px-4 py-1
      border-b border-[var(--border)]
      bg-[var(--bg-main)]
      font-mono select-none
      "
        >
            <span className="opacity-50">Portfolio</span>
            {parts.map((part, i) => (
                <React.Fragment key={i}>
                    <ChevronRight size={10} className="opacity-50" />
                    <span className={i === parts.length - 1 ? 'text-[var(--text-primary)]' : ''}>
                        {part}
                    </span>
                </React.Fragment>
            ))}
        </div>
    );
};


/* --- CONTENT RENDERER --- */

const ContentRenderer = ({
    type,
    data,
    title,
    onOpenFile,
    content,
    lang,
    editorSettings
}) => {  // Use a ref for the scrollable container to pass to minimap
    const editorScrollRef = useRef(null);

    // Logic to get breadcrumb path
    const getPath = () => {
        if (type === 'home') return 'src/pages/home.tsx';
        if (type === 'projects') return 'src/pages/projects.tsx';

        if (type === 'detail' && data)
            return `src/projects/${data.title}.tsx`;

        if (type === 'code') {
            // recruiter files
            if (title?.startsWith('recruiter/'))
                return title;

            // pages-level json
            if (title === 'projects.json')
                return 'src/pages/projects.json';

            // root config files
            if (title?.startsWith('.'))
                return title;

            // components
            if (title?.endsWith('.tsx'))
                return `src/components/${title}`;

            return title || 'Unknown';
        }

        if (type === 'readme') return 'README.md';

        return '';
    };

    const path = getPath();

    // ... inside ContentRenderer ...

    if (type === 'code') {
        // 1. Keep the trimming logic (or remove .trim() if you want exact file representation)
        const cleanContent = content ? content.trim() : "";
        const lines = cleanContent ? cleanContent.split('\n') : [];

        return (
            <div className="h-full flex flex-col bg-[var(--bg-panel)]">
                <Breadcrumbs path={path} />

                <div className="flex-1 overflow-hidden flex relative">

                    {/* Main Scrollable Editor Area */}
                    <div
                        ref={editorScrollRef}
                        className="flex-1 overflow-auto custom-scrollbar flex flex-col"
                    >
                        {/* We map over LINES instead of creating two separate columns.
               This ensures that if a line wraps, the container grows, 
               and the number stays aligned to the top.
            */}
                        <div className="min-w-fit min-h-full py-4">
                            {lines.map((line, i) => (
                                <div key={i} className="flex flex-row hover:bg-[var(--bg-activity)]/30 w-full">

                                    {/* Line Number: Fixed width, aligns to top, does not shrink */}
                                    <div className="w-12 shrink-0 text-right pr-4 text-[var(--line-number)] font-mono text-sm select-none opacity-50 leading-relaxed">
                                        {i + 1}
                                    </div>

                                    {/* Code Content: 
                     1. min-w-0 is CRITICAL. It allows flex child to shrink below content size to force wrapping.
                     2. whitespace-pre-wrap enables wrapping.
                     3. break-words breaks long strings.
                  */}
                                    <div
                                        className={`
                      flex-1 pl-2 font-mono text-sm text-[var(--text-primary)] leading-relaxed min-w-0 pr-4
                      ${editorSettings.wordWrap
                                                ? "whitespace-pre-wrap break-words break-all"
                                                : "whitespace-pre"
                                            }
                    `}
                                    >
                                        {/* Render a space if the line is empty so it keeps its height */}
                                        {line || " "}
                                    </div>
                                </div>
                            ))}

                            {/* Fallback if file is completely empty */}
                            {lines.length === 0 && (
                                <div className="pl-14 text-[var(--text-secondary)] italic text-xs">No content.</div>
                            )}
                        </div>
                    </div>

                    {/* REAL MINIMAP (Keep as is) */}
                    {editorSettings.minimap && (
                        <RealMinimap
                            content={cleanContent}
                            editorRef={editorScrollRef}
                        />
                    )}
                </div>
            </div>
        );
    }

    // ... rest of component

    if (type === 'home') {
        const featuredProjects = PROJECTS_DATA.filter(p => p.featured);
        const recentActivity = [
            { action: "Optimizing", target: "frontend performance", time: "ongoing" },
            { action: "Designing", target: "scalable systems", time: "active" },
            { action: "Refining", target: "developer experience", time: "constant" },
            { action: "Building", target: "production-ready tools", time: "always" },
        ];

        const WORDS = ["HELLO", "BUILDER", "SYSTEMS", "REACT", "NETWORK"];
        const [wordIndex, setWordIndex] = useState(0);

        useEffect(() => {
            const interval = setInterval(() => {
                setWordIndex(i => (i + 1) % WORDS.length);
            }, 3000);
            return () => clearInterval(interval);
        }, []);

        const TEXT = WORDS[wordIndex];
        const LETTER_WIDTH = 5;
        const LETTER_GAP = 1;

        const getDotActive = (col, row) => {
            const letterIndex = Math.floor(col / (LETTER_WIDTH + LETTER_GAP));
            const localCol = col % (LETTER_WIDTH + LETTER_GAP);
            if (localCol >= LETTER_WIDTH) return false;
            const letter = TEXT[letterIndex];
            if (!letter) return false;
            const bitmap = FONT_5x7[letter.toUpperCase()];
            if (!bitmap) return false;
            return bitmap[row]?.[localCol] === "1";
        };

        return (
            <div className="h-full overflow-y-auto custom-scrollbar">
                <Breadcrumbs path={path} />
                <div className="p-4 md:p-12 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <span className="text-[var(--text-secondary)] font-mono text-sm block mb-2">// Initializing Portfolio System...</span>
                            <h1 className="text-3xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
                                <span className="mr-3">Hello, I'm</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                    <TypingEffect text="Arnav" speed={150} />
                                </span>
                                <span className="ml-1 text-cyan-400 animate-[blink_1s_steps(1)_infinite]">_</span>
                            </h1>
                        </div>
                    </div>
                    <div className="pl-4 md:pl-6 border-l-2 border-[var(--border)] space-y-4 font-mono text-xs md:text-base mb-12">
                        <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                            <span className="text-purple-400 min-w-[80px] md:min-w-[100px]">current_role:</span>
                            <span className="text-amber-200">"Full Stack Engineer"</span>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                            <span className="text-purple-400 min-w-[80px] md:min-w-[100px]">location:</span>
                            <span className="text-emerald-300">"Remote"</span>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                            <span className="text-purple-400 min-w-[80px] md:min-w-[100px]">status:</span>
                            <span className="text-sky-300">"Building cool things"</span>
                        </div>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2 font-mono">
                            <Zap size={18} className="text-yellow-400" /> Pinned Deployments
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProjects.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() =>
                                        onOpenFile({
                                            id: p.id,
                                            title: `${p.title}.tsx`,
                                            type: 'detail',
                                            data: p
                                        })
                                    }
                                    className="bg-[var(--bg-panel)] border border-[var(--border)] hover:border-indigo-500/50 rounded-lg p-5 cursor-pointer hover:-translate-y-1 transition-all group shadow-lg"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <FileCode size={16} className="text-indigo-400" />
                                            <span className="text-[var(--text-primary)] font-mono text-sm font-semibold truncate max-w-[150px]">
                                                {p.title}
                                            </span>
                                        </div>
                                        <ExternalLink size={12} className="text-[var(--text-secondary)] group-hover:text-white" />
                                    </div>
                                    <p className="text-[var(--text-secondary)] text-xs line-clamp-2 mb-4 h-8">
                                        {p.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-12 flex flex-wrap gap-4">
                        <button
                            onClick={() =>
                                onOpenFile({
                                    id: 'projects_tsx',
                                    title: 'projects.tsx',
                                    type: 'projects'
                                })
                            }
                            className="group flex items-center gap-3 px-6 py-3 bg-indigo-600/10 border border-indigo-500/50 text-indigo-300 font-mono text-sm rounded-md shadow-[0_0_0_1px_rgba(99,102,241,0.2)] hover:bg-indigo-600/20 hover:border-indigo-400 hover:text-indigo-200 transition-colors"
                        >
                            <Terminal size={16} className="text-indigo-400 group-hover:text-indigo-300" />
                            <span className="tracking-wide">./view_all_projects</span>
                        </button>
                    </div>
                    <div className="mb-12">
                        <h2 className="text-sm font-bold text-[var(--text-secondary)] mb-4 flex items-center gap-2 font-mono uppercase tracking-wider">
                            <Activity size={14} className="text-emerald-500" /> Contribution Map
                        </h2>
                        <div className="inline-block bg-[var(--bg-activity)] border border-[var(--border)] p-3 rounded-lg max-w-full">
                            <div className="overflow-x-auto overflow-y-hidden">
                                <div className="flex gap-1 min-w-max">
                                    {Array.from({ length: 50 }).map((_, col) => (
                                        <div key={col} className="flex flex-col gap-1">
                                            {Array.from({ length: 7 }).map((_, row) => {
                                                const isText = getDotActive(col - 2, row);
                                                const isRandom = Math.random() > 0.92;
                                                let color = 'bg-[var(--border)]';
                                                if (isText) color = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]';
                                                else if (isRandom) color = 'bg-emerald-900/50';
                                                return (
                                                    <div key={row} className={`w-2.5 h-2.5 rounded-sm ${color} transition-all duration-500`} />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-12">
                        <h2 className="text-sm font-bold text-[var(--text-secondary)] mb-4 flex items-center gap-2 font-mono uppercase tracking-wider">
                            <GitBranch size={14} className="text-blue-500" /> Recent Activity
                        </h2>
                        <div className="space-y-2">
                            {recentActivity.map((act, i) => (
                                <div key={i} className="flex items-center justify-between text-sm bg-[var(--bg-activity)]/20 border border-[var(--border)]/50 p-3 rounded hover:border-[var(--border)] transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <span className="text-[var(--text-secondary)] font-mono">{act.action} <span className="text-indigo-300 font-bold group-hover:underline cursor-pointer">{act.target}</span></span>
                                    </div>
                                    <span className="text-xs text-[var(--text-secondary)] font-mono">{act.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'projects') {
        const [showFilters, setShowFilters] = useState(false);
        const [techFilters, setTechFilters] = useState([]);
        const [langFilters, setLangFilters] = useState([]);

        const allTech = Array.from(new Set(PROJECTS_DATA.flatMap(p => p.tech || []))).sort();
        const allLanguages = Array.from(new Set(PROJECTS_DATA.flatMap(p => (p.languages || []).map(l => l.name)))).sort();

        const filteredProjects = PROJECTS_DATA.filter(p => {
            const techMatch = techFilters.length === 0 || p.tech?.some(t => techFilters.includes(t));
            const langMatch = langFilters.length === 0 || p.languages?.some(l => langFilters.includes(l.name));
            return techMatch && langMatch;
        });

        const toggleFilter = (value, setFn) => {
            setFn(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
        };

        return (
            <div className="h-full overflow-y-auto custom-scrollbar">
                <Breadcrumbs path={path} />
                <div className="p-4 md:p-12 max-w-7xl mx-auto pb-24">
                    <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                            <Folder size={20} className="text-emerald-400" /> /projects
                        </h2>
                        <button
                            onClick={() => setShowFilters(v => !v)}
                            className="text-xs font-mono text-[var(--text-secondary)] hover:text-white flex items-center gap-2"
                        >
                            <Filter size={14} /> {showFilters ? "hide_filters" : "show_filters"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-8">
                        {showFilters && (
                            <div className="space-y-6">
                                <div className="bg-[var(--bg-activity)] border border-[var(--border)] rounded-lg p-4">
                                    <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3 font-mono">Tech Stack</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {allTech.map(t => (
                                            <button
                                                key={t}
                                                onClick={() => toggleFilter(t, setTechFilters)}
                                                className={`px-2 py-1 text-[10px] font-mono rounded border transition-all ${techFilters.includes(t) ? "bg-indigo-500/20 border-indigo-400 text-indigo-300" : "bg-[var(--bg-main)] border-[var(--border)] text-[var(--text-secondary)] hover:border-slate-500"}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-[var(--bg-activity)] border border-[var(--border)] rounded-lg p-4">
                                    <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3 font-mono">Languages</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {allLanguages.map(l => (
                                            <button
                                                key={l}
                                                onClick={() => toggleFilter(l, setLangFilters)}
                                                className={`px-2 py-1 text-[10px] font-mono rounded border transition-all ${langFilters.includes(l) ? "bg-emerald-500/20 border-emerald-400 text-emerald-300" : "bg-[var(--bg-main)] border-[var(--border)] text-[var(--text-secondary)] hover:border-slate-500"}`}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {(techFilters.length > 0 || langFilters.length > 0) && (
                                    <button
                                        onClick={() => { setTechFilters([]); setLangFilters([]); }}
                                        className="text-xs font-mono text-[var(--text-secondary)] hover:text-red-400"
                                    >
                                        clear_all_filters
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProjects.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => onOpenFile({ id: p.id, title: `${p.title}.tsx`, type: "detail", data: p })}
                                    className="group bg-[var(--bg-panel)] border border-[var(--border)] hover:border-indigo-500/40 rounded-lg overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="h-32 bg-[var(--bg-activity)] relative overflow-hidden">
                                        <img
                                            src={p.image}
                                            alt={p.title}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-[var(--text-primary)] font-bold mb-1 group-hover:text-indigo-400 truncate">{p.title}</h3>
                                        <p className="text-[var(--text-secondary)] text-xs line-clamp-2 mb-3">{p.description}</p>
                                        <div className="flex flex-wrap gap-2">{p.tech?.slice(0, 3).map(t => <TechTag key={t} label={t} />)}</div>
                                    </div>
                                </div>
                            ))}
                            {filteredProjects.length === 0 && (
                                <div className="col-span-full text-center text-[var(--text-secondary)] font-mono text-sm mt-12">No projects match selected filters.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    if (type === 'detail' && data) {
        return (
            <div className="h-full overflow-y-auto custom-scrollbar">
                <Breadcrumbs path={path} />
                <div className="p-4 md:p-12 max-w-6xl mx-auto pb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8 min-w-0">
                        <div className="space-y-8 min-w-0">
                            <div>
                                <div className="flex items-center gap-3 text-xs md:text-sm font-mono text-[var(--text-secondary)] mb-2">
                                    <span className="flex items-center gap-1"><GitBranch size={12} /> main</span>
                                    <span className="text-[var(--border)]">|</span>
                                    <span className="flex items-center gap-1"><Activity size={12} /> {data.deployHistory?.[0]?.version || 'v1.0.0'}</span>
                                </div>
                                <h1 className="text-2xl md:text-5xl font-bold text-[var(--text-primary)] mb-2 tracking-tight break-words">{data.title}</h1>
                                <p className="text-base md:text-xl text-[var(--text-secondary)] font-light border-l-2 border-emerald-500 pl-4 break-words">{data.subtitle}</p>
                            </div>
                            <div className="bg-[var(--bg-activity)]/30 border border-[var(--border)] rounded-lg p-4 md:p-6">
                                <div className="flex items-center gap-2 mb-4 text-[var(--text-primary)] font-mono text-sm border-b border-[var(--border)] pb-2">
                                    <FileText size={14} className="text-sky-400" /> README.md
                                </div>
                                <p className="text-[var(--text-primary)] text-sm leading-relaxed font-mono opacity-90 whitespace-pre-wrap">{data.longDescription}</p>
                            </div>
                            {data.architecture && (
                                <div className="bg-[var(--bg-activity)] border border-[var(--border)] rounded-lg p-4 md:p-6 overflow-hidden">
                                    <div className="flex items-center gap-2 mb-4 text-[var(--text-primary)] font-mono text-sm">
                                        <Server size={14} className="text-orange-400" /> System Architecture
                                    </div>
                                    <div className="overflow-x-auto w-full custom-scrollbar">
                                        <pre className="font-mono text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed min-w-max">{data.architecture}</pre>
                                    </div>
                                </div>
                            )}
                            {data.snippet && (
                                <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-lg overflow-hidden min-w-0">
                                    <div className="bg-[var(--bg-activity)] px-4 py-2 border-b border-[var(--border)] flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]"><Code size={12} /> core_logic.ts</div>
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-red-500/20" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                                            <div className="w-2 h-2 rounded-full bg-green-500/20" />
                                        </div>
                                    </div>
                                    <div className="p-4 overflow-x-auto w-full custom-scrollbar">
                                        <pre className="font-mono text-xs md:text-sm text-emerald-300/90 leading-relaxed min-w-max">{data.snippet}</pre>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-6 min-w-0">
                            <div className="rounded-lg border border-[var(--border)] shadow-2xl relative group p-4 flex justify-center items-center bg-black/20 overflow-hidden h-[240px] sm:h-auto">
                                <img src={data.image} alt={data.title} className="max-w-full max-h-full object-contain sm:w-auto sm:h-auto sm:object-cover" />
                            </div>
                            <div className="bg-[var(--bg-activity)]/30 border border-[var(--border)] rounded-lg p-5">
                                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4 font-mono flex items-center gap-2">Languages</h3>
                                <div className="flex h-3 rounded-full overflow-hidden mb-3">
                                    {data.languages.map((lang, index) => (
                                        <div key={index} style={{ width: `${lang.percent}%`, backgroundColor: lang.color }} className="h-full" />
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {data.languages.map((lang, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                                            <span className="text-xs text-[var(--text-primary)] font-mono">{lang.name} <span className="text-[var(--text-secondary)]">{lang.percent}%</span></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-[var(--bg-activity)]/30 border border-[var(--border)] rounded-lg p-5">
                                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4 font-mono flex items-center gap-2"><HardDrive size={12} /> Deploy Log</h3>
                                <div className="space-y-3">
                                    {data.deployHistory ? data.deployHistory.map((deploy, idx) => (
                                        <div key={idx} className={`flex gap-2 ${idx !== 0 ? 'opacity-60 hover:opacity-100 transition-opacity' : ''}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${deploy.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            <div>
                                                <div className="text-xs text-[var(--text-primary)] font-mono">{deploy.version} - {deploy.msg}</div>
                                                <div className="text-[10px] text-[var(--text-secondary)]">{deploy.time}</div>
                                            </div>
                                        </div>
                                    )) : <div className="text-xs text-[var(--text-secondary)] italic">No deployment history found.</div>}
                                </div>
                            </div>
                            <div className="bg-[var(--bg-activity)]/30 border border-[var(--border)] rounded-lg p-6">
                                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4 font-mono">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">{data.tech.map(t => <TechTag key={t} label={t} />)}</div>
                            </div>
                            {data.links && (data.links.github || data.links.live) && (
                                <div className="flex flex-col gap-3">
                                    {typeof data.links.github === "string" && data.links.github.trim() !== "" && (
                                        <a href={data.links.github} target="_blank" rel="noopener noreferrer" className="py-3 bg-[var(--bg-activity)] border border-[var(--border)] hover:border-indigo-500 text-[var(--text-primary)] hover:text-indigo-400 rounded flex items-center justify-center gap-2 transition-all font-mono text-sm">
                                            <Github size={16} /> git checkout
                                        </a>
                                    )}
                                    {typeof data.links.live === "string" && data.links.live.trim() !== "" && (
                                        <a href={data.links.live} target="_blank" rel="noopener noreferrer" className="py-3 bg-indigo-600/10 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/20 rounded flex items-center justify-center gap-2 transition-all font-mono text-sm">
                                            <Globe size={16} /> view_deployment
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    if (type === 'readme') {
        const [isPreview, setIsPreview] = useState(true);
        return (
            <div className="h-full flex flex-col">
                <Breadcrumbs path={path} />
                <div className="p-4 md:p-12 max-w-4xl mx-auto w-full h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
                        <div className="flex items-center gap-2 text-[var(--text-primary)] font-mono font-bold text-xl">
                            <FileText size={20} className="text-blue-400" />
                            <span>README.md</span>
                        </div>
                        <div className="flex bg-[var(--bg-activity)] rounded-lg p-1 border border-[var(--border)]">
                            <button onClick={() => setIsPreview(true)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${isPreview ? 'bg-[var(--bg-main)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                                <Eye size={14} /> Preview
                            </button>
                            <button onClick={() => setIsPreview(false)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${!isPreview ? 'bg-[var(--bg-main)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                                <Edit3 size={14} /> Source
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {isPreview ? (
                            <div className="prose prose-invert prose-slate max-w-none font-sans text-[var(--text-primary)]">
                                <h1 className="flex items-center gap-3 text-3xl font-bold mb-4"><span className="text-4xl">⚙️</span><span>Hi, I’m Arnav</span></h1>
                                <p className="lead text-lg text-[var(--text-secondary)] mb-6">Developer focused on building performant interfaces, low-level tooling, and systems that actually ship.</p>
                                <hr className="border-[var(--border)] my-8" />
                                <h3 className="text-emerald-400 text-xl font-bold mb-4">🧠 What I Work On</h3>
                                <p className="mb-6 text-[var(--text-primary)] leading-relaxed">I build full-stack applications with React and Node.js, desktop tools in C++ and Python, and infrastructure-level solutions involving networking, automation, and system internals.</p>
                                <h3 className="text-indigo-400 text-xl font-bold mb-4">🛠 Core Stack</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none pl-0 mb-8">
                                    <li className="flex items-center gap-2 bg-[var(--bg-activity)]/50 p-2 rounded border border-[var(--border)]"><span className="text-cyan-400">⚛️</span> React / Vite / Tailwind</li>
                                    <li className="flex items-center gap-2 bg-[var(--bg-activity)]/50 p-2 rounded border border-[var(--border)]"><span className="text-green-500">🟢</span> Node.js / Express</li>
                                    <li className="flex items-center gap-2 bg-[var(--bg-activity)]/50 p-2 rounded border border-[var(--border)]"><span className="text-blue-400">🔷</span> TypeScript / JavaScript</li>
                                    <li className="flex items-center gap-2 bg-[var(--bg-activity)]/50 p-2 rounded border border-[var(--border)]"><span className="text-orange-400">🧠</span> C++ / Win32 / System APIs</li>
                                    <li className="flex items-center gap-2 bg-[var(--bg-activity)]/50 p-2 rounded border border-[var(--border)]"><span className="text-yellow-400">🐍</span> Python / Automation</li>
                                    <li className="flex items-center gap-2 bg-[var(--bg-activity)]/50 p-2 rounded border border-[var(--border)]"><span className="text-sky-400">🌐</span> Networking / Proxies / Tunnels</li>
                                </ul>
                            </div>
                        ) : (
                            <div className="flex">
                                <div className="w-8 border-r border-[var(--border)] text-right pr-2 text-[var(--line-number)] select-none">1<br />2<br />3</div>
                                <div className="pl-2 font-mono text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                                    {`# ⚙️ Hi, I’m Arnav\n\nDeveloper focused on building performant interfaces...`}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

/* --- MAIN APP --- */

const App = () => {
    const [tabs, setTabs] = useState([{ id: 'home', title: 'home.tsx', type: 'home', data: null }]);
    const [activeTabId, setActiveTabId] = useState('home');
    const [windows, setWindows] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [dockHighlight, setDockHighlight] = useState(false);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(() => {
        const saved = localStorage.getItem('portfolio_theme');
        // Check if saved theme exists in your THEMES object, fallback to 'default'
        return saved && THEMES[saved] ? saved : 'default';
    });
    const [contextMenu, setContextMenu] = useState(null); // { x, y, type, id }
    const [toasts, setToasts] = useState([]);
    // Initialize from Local Storage if available
    const [editorSettings, setEditorSettings] = useState(() => {
        const saved = localStorage.getItem('portfolio_editor_settings');
        return saved ? JSON.parse(saved) : { minimap: true, wordWrap: false };
    });
    // Save to Local Storage whenever settings change
    useEffect(() => {
        localStorage.setItem('portfolio_editor_settings', JSON.stringify(editorSettings));
    }, [editorSettings]);
    const tabBarRef = useRef(null);
    const draggingTabId = useRef(null);
    const [dropIndex, setDropIndex] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const dragItem = useRef(null);
    const scrollPositions = useRef({});
    const editorScrollRef = useRef(null);
    const tabRefs = useRef({});
    const tabScrollRef = useRef(null);
    useEffect(() => {
        const handler = () => setIsTerminalOpen(true);
        window.addEventListener('open-terminal', handler);
        return () => window.removeEventListener('open-terminal', handler);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            const themeKey = e.detail;
            if (THEMES[themeKey]) {
                setCurrentTheme(themeKey);
            }
        };

        window.addEventListener('set-theme', handler);
        return () => window.removeEventListener('set-theme', handler);
    }, []);
    // 1. Add a Ref to track current settings (prevents stale closures in the listener)
    const settingsRef = useRef(editorSettings);

    // 2. Keep the Ref in sync with the state
    useEffect(() => {
        settingsRef.current = editorSettings;
    }, [editorSettings]);

    // 3. The Fixed Listener
    useEffect(() => {
        const handler = (e) => {
            const key = e.detail; // 'minimap' or 'wordWrap'

            // Get the CURRENT value from the ref
            const currentVal = settingsRef.current[key];
            const newVal = !currentVal;

            // TRIGGER TOAST HERE (Outside the state setter)
            addToast(`Toggled ${key === 'wordWrap' ? 'Word Wrap' : 'Minimap'} ${newVal ? 'On' : 'Off'}`, 'info');

            // Update the state
            setEditorSettings(prev => ({
                ...prev,
                [key]: newVal
            }));
        };

        window.addEventListener('toggle-setting', handler);
        return () => window.removeEventListener('toggle-setting', handler);
    }, []);
    // Apply Theme Colors
    // Apply Theme Colors & Save
    useEffect(() => {
        // Save to local storage
        localStorage.setItem('portfolio_theme', currentTheme);

        // Apply CSS variables
        const themeColors = THEMES[currentTheme].colors;
        const root = document.documentElement;
        for (const [key, value] of Object.entries(themeColors)) {
            root.style.setProperty(key, value);
        }
    }, [currentTheme]);

    // Global Key Listeners for Command Palette
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close context menu on click
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    useEffect(() => {
        const el = editorScrollRef.current;
        if (!el) return;
        el.scrollTop = scrollPositions.current[activeTabId] ?? 0;
    }, [activeTabId]);

    useEffect(() => {
        if (isDragging) {
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'grabbing';
        } else {
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        }
        return () => {
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [isDragging]);
    useEffect(() => {
        if (isDragging) {
            document.documentElement.classList.add('dragging');
        } else {
            document.documentElement.classList.remove('dragging');
        }
        return () => {
            document.documentElement.classList.remove('dragging');
        };
    }, [isDragging]);

    useEffect(() => {
        const el = tabRefs.current[activeTabId];
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
    }, [activeTabId]);

    const addToast = (msg, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, msg, type }]);
        setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)); }, 7000);
    };

    const openFile = useCallback((file) => {
        const existingWindow = windows.find(w => w.id === file.id);
        if (existingWindow) {
            setWindows(prev => prev.map(w => w.id === file.id ? { ...w, zIndex: 100 } : { ...w, zIndex: 40 }));
            return;
        }
        const existingTab = tabs.find(t => t.id === file.id);
        if (existingTab) {
            setActiveTabId(file.id);
            return;
        }
        setTabs(prev => [...prev, file]);
        setActiveTabId(file.id);
    }, [tabs, windows]);

    const closeTab = (e, id) => {
        e?.stopPropagation();
        if (id === 'home') return;
        const newTabs = tabs.filter(t => t.id !== id);
        setTabs(newTabs);
        if (activeTabId === id && newTabs.length > 0) setActiveTabId(newTabs[newTabs.length - 1].id);
    };

    const closeOtherTabs = (id) => {
        const newTabs = tabs.filter(t => t.id === id || t.id === 'home');
        setTabs(newTabs);
        setActiveTabId(id);
    }

    const closeWindow = (e, id) => {
        e.stopPropagation();
        setWindows(prev => prev.filter(w => w.id !== id));
    };

    const toggleMaximize = (e, id) => {
        e.stopPropagation();
        setWindows(prev => prev.map(w => {
            if (w.id === id) {
                if (w.isMaximized) {
                    return { ...w, isMaximized: false, position: w.prevPos || { x: 100, y: 100 }, size: w.prevSize || { w: 600, h: 400 } };
                } else {
                    return { ...w, isMaximized: true, prevPos: w.position, prevSize: w.size, position: { x: 0, y: 0 }, size: { w: '100%', h: '100%' } };
                }
            }
            return w;
        }));
    };
    useEffect(() => {
        const handler = (e) => {
            const { id, file } = e.detail;

            draggingTabId.current = id;

            dragItem.current = {
                type: 'tab',
                id,
                startX: 0,
                startY: 0,
                initialPos: null,
                initialSize: null,
                hasDetached: false
            };

            setIsDragging(true);

            openFile(file); // ❌ PROBLEM
        };

        window.addEventListener('explorer-drag-start', handler);
        return () => window.removeEventListener('explorer-drag-start', handler);
    }, [openFile]);

    const handleContextMenu = (e, type, id) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, type, id });
    };

    const handleMouseDown = (e, type, id, extra = {}) => {
        // FIX 1: Allow default behavior (text selection) when clicking content ('focus')
        // Only prevent default for drag handles (window title, resize grips, tabs)
        if (type !== 'focus') {
            e.preventDefault();
        }

        e.stopPropagation();
        if (e.button !== 0) return;

        const activeWindow = windows.find(w => w.id === id);

        // Handle Z-Index / Focus logic
        if (type === 'focus' || type === 'window') {
            setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: 100 } : { ...w, zIndex: 40 }));

            // FIX 2: If we are just focusing (clicking content), STOP HERE.
            // Do not attach drag listeners. This allows the browser to handle text selection naturally.
            if (type === 'focus') return;
        }

        // 1. Prepare drag data, but DO NOT set isDragging(true) yet
        dragItem.current = {
            type: extra.action || type,
            id,
            startX: e.clientX,
            startY: e.clientY,
            initialPos: activeWindow ? activeWindow.position : null,
            initialSize: activeWindow ? activeWindow.size : null,
            hasDetached: false,
            dir: extra.dir
        };

        // 2. Create temporary listeners to detect if user actually moves mouse > 5px
        const handleDragStartCheck = (moveEvent) => {
            const dx = moveEvent.clientX - e.clientX;
            const dy = moveEvent.clientY - e.clientY;

            // 3. Threshold check (5px)
            if (Math.hypot(dx, dy) > 5) {
                setIsDragging(true); // <--- Only enable dragging state after movement

                // Cleanup temporary listeners (the main useEffect will attach the real ones now)
                window.removeEventListener('mousemove', handleDragStartCheck);
                window.removeEventListener('mouseup', handleDragEndCheck);
            }
        };

        const handleDragEndCheck = () => {
            // User clicked but didn't drag enough -> It's just a click
            window.removeEventListener('mousemove', handleDragStartCheck);
            window.removeEventListener('mouseup', handleDragEndCheck);

            // Clean up refs since drag never started
            dragItem.current = null;
            draggingTabId.current = null;
        };

        // Attach temporary listeners
        window.addEventListener('mousemove', handleDragStartCheck);
        window.addEventListener('mouseup', handleDragEndCheck);
    };

    // Improved calculation that uses centers of elements for more stable insertion
    const getTabInsertIndexFromX = (clientX, excludeId) => {
        const tabElements = Object.entries(tabRefs.current)
            .filter(([id, el]) => id !== excludeId && !!el && document.body.contains(el))
            .map(([id, el]) => {
                const rect = el.getBoundingClientRect();
                return { id, center: rect.left + rect.width / 2 };
            })
            .sort((a, b) => a.center - b.center);

        if (tabElements.length === 0) return 0;

        // Find the first element whose center is greater than clientX
        const index = tabElements.findIndex(t => clientX < t.center);

        // If not found, it means it's to the right of all elements
        if (index === -1) return tabElements.length;

        return index;
    };

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !dragItem.current) return;
        setMousePos({ x: e.clientX, y: e.clientY });

        const { type, id, startX, startY, initialPos, initialSize, hasDetached, dir } = dragItem.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // --- TAB DRAGGING LOGIC ---
        if (type === 'tab') {
            if (id === 'home') return; // Cannot drag home

            // Check if inside tab bar
            let isOverTabBar = false;
            if (tabBarRef.current) {
                const barRect = tabBarRef.current.getBoundingClientRect();
                // Expanded hit area for better UX
                isOverTabBar = e.clientY >= barRect.top - 20 && e.clientY <= barRect.bottom + 20;
            }

            if (isOverTabBar) {
                const idx = getTabInsertIndexFromX(e.clientX, draggingTabId.current);
                setDropIndex(idx);
            } else {
                setDropIndex(null);
                // Logic to detach window if dragged far enough
                if (!hasDetached && Math.abs(dy) > 50) {
                    const tabToDetach = tabs.find(t => t.id === id);
                    if (tabToDetach) {
                        const newTabs = tabs.filter(t => t.id !== id);
                        setTabs(newTabs);
                        if (activeTabId === id && newTabs.length > 0) setActiveTabId(newTabs[newTabs.length - 1].id);

                        const viewportW = window.innerWidth;
                        const viewportH = window.innerHeight;
                        const DEFAULT_W = Math.min(900, viewportW * 0.75);
                        const DEFAULT_H = Math.min(650, viewportH * 0.75);
                        const posX = Math.max(20, e.clientX - DEFAULT_W / 2);
                        const posY = Math.max(40, e.clientY - 16);

                        const newWindow = {
                            ...tabToDetach,
                            position: { x: posX, y: posY },
                            size: { w: DEFAULT_W, h: DEFAULT_H },
                            zIndex: 100,
                            isMaximized: false
                        };
                        setWindows(prev => [...prev, newWindow]);

                        // Convert drag operation to window drag
                        dragItem.current = {
                            type: 'window',
                            id,
                            startX: e.clientX,
                            startY: e.clientY,
                            initialPos: { x: posX, y: posY },
                            initialSize: { w: DEFAULT_W, h: DEFAULT_H },
                            hasDetached: true
                        };
                        setDropIndex(null);
                    }
                }
            }
        }

        // --- WINDOW DRAGGING LOGIC ---
        if (type === 'window') {
            const activeWindow = windows.find(w => w.id === id);
            if (activeWindow && activeWindow.isMaximized) {
                // Snap out of maximize if dragged
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                    const restoredW = activeWindow.prevSize?.w || 600;
                    const newX = e.clientX - (restoredW / 2);
                    const newY = e.clientY;
                    dragItem.current.initialPos = { x: newX, y: newY };
                    dragItem.current.startX = e.clientX;
                    dragItem.current.startY = e.clientY;
                    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: false, size: w.prevSize || { w: 600, h: 400 }, position: { x: newX, y: newY } } : w));
                }
                return;
            }
            const newX = initialPos.x + dx;
            const newY = initialPos.y + dy;
            setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x: newX, y: newY } } : w));
            if (e.clientY < 60) setDockHighlight(true); else setDockHighlight(false);
        }

        // --- RESIZING LOGIC ---
        if (type === 'resize') {
            let newX = initialPos.x;
            let newY = initialPos.y;
            let newW = initialSize.w;
            let newH = initialSize.h;
            if (dir.includes('e')) newW = Math.max(300, initialSize.w + dx);
            else if (dir.includes('w')) {
                const possibleW = initialSize.w - dx;
                if (possibleW > 300) {
                    newX = initialPos.x + dx;
                    newW = possibleW;
                }
            }
            if (dir.includes('s')) newH = Math.max(200, initialSize.h + dy);
            else if (dir.includes('n')) {
                const possibleH = initialSize.h - dy;
                if (possibleH > 200) {
                    newY = initialPos.y + dy;
                    newH = possibleH;
                }
            }
            setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x: newX, y: newY }, size: { w: newW, h: newH } } : w));
        }
    }, [isDragging, tabs, activeTabId, windows]);

    const handleMouseUp = useCallback((e) => {
        setDropIndex(null);
        if (!isDragging || !dragItem.current) return;
        const { type, id } = dragItem.current;

        if (type === 'tab' && draggingTabId.current) {
            const dragId = draggingTabId.current;
            setTabs(prev => {
                // Find the item being dragged
                const draggedItem = prev.find(t => t.id === dragId);
                if (!draggedItem) return prev;

                // Remove it from the list temporarily to calculate pure index
                const filtered = prev.filter(t => t.id !== dragId);

                // Calculate where it should go based on the filtered list's DOM positions
                const insertIndex = getTabInsertIndexFromX(e.clientX, dragId);

                // If index is invalid, return original
                if (insertIndex == null) return prev;

                // Reconstruct array
                const next = [...filtered];
                next.splice(insertIndex, 0, draggedItem);
                return next;
            });
            setActiveTabId(dragId);
        }

        if (type === 'window' && tabBarRef.current && (() => { const r = tabBarRef.current.getBoundingClientRect(); return e.clientY >= r.top && e.clientY <= r.bottom + 20; })()) {
            const win = windows.find(w => w.id === id);
            if (!win) return;
            setWindows(prev => prev.filter(w => w.id !== id));
            setTabs(prev => {
                const insertIndex = getTabInsertIndexFromX(e.clientX, id);
                if (insertIndex == null) return [...prev, win];
                const next = [...prev];
                next.splice(insertIndex, 0, win);
                return next;
            });
            setActiveTabId(id);
        }

        setIsDragging(false);
        setDockHighlight(false);
        dragItem.current = null;
        draggingTabId.current = null;
    }, [isDragging, windows]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, setTheme: setCurrentTheme }}>
            <div className="h-screen w-full bg-[var(--bg-main)] text-[var(--text-primary)] font-sans overflow-hidden flex selection:bg-[var(--selection)] selection:text-white relative transition-colors duration-300">
                <CodeRainBackground />
                <CustomScrollbarStyles />
                <ToastContainer toasts={toasts} />

                {/* CONTEXT MENU */}
                {contextMenu && (
                    <div
                        className="fixed z-[9999] bg-[var(--bg-panel)] border border-[var(--border)] rounded shadow-xl py-1 min-w-[150px] animate-in fade-in zoom-in-95 duration-100"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {contextMenu.type === 'tab' && (
                            <>
                                <button onClick={() => { closeTab(null, contextMenu.id); setContextMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-activity)] flex items-center gap-2">
                                    <X size={12} /> Close
                                </button>
                                <button onClick={() => { closeOtherTabs(contextMenu.id); setContextMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-activity)] flex items-center gap-2">
                                    <MinusCircle size={12} /> Close Others
                                </button>
                                <div className="h-px bg-[var(--border)] my-1" />
                                <button onClick={() => { addToast('Path copied to clipboard'); setContextMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-activity)] flex items-center gap-2">
                                    <CopyIcon size={12} /> Copy Path
                                </button>
                            </>
                        )}
                    </div>
                )}

                <Sidebar
                    onOpenFile={openFile}
                    onToast={addToast}
                    onToggleTerminal={() => setIsTerminalOpen(true)}
                    tabs={tabs}
                    activeTabId={activeTabId}
                    setActiveTabId={setActiveTabId}
                    setTabs={setTabs}
                    editorSettings={editorSettings}
                    setEditorSettings={setEditorSettings}
                />

                <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden min-w-0">
                    <div
                        ref={(el) => { tabScrollRef.current = el; tabBarRef.current = el; }}
                        onWheel={(e) => { if (e.deltaY !== 0) { e.preventDefault(); e.currentTarget.scrollLeft += e.deltaY; } }}
                        className={`h-10 bg-[var(--bg-activity)] border-b border-[var(--border)] flex items-end px-2 gap-1 overflow-x-auto overflow-y-hidden relative transition-colors duration-300 shrink-0 whitespace-nowrap custom-scrollbar ${dockHighlight ? 'bg-indigo-900/20 border-indigo-500/50' : ''}`}
                    >
                        {dockHighlight && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-indigo-500/10 text-indigo-300 font-mono text-xs z-50">
                                <ArrowLeft size={14} className="rotate-90 mr-2" /> Release to Dock
                            </div>
                        )}
                        {(() => {
                            const draggingIndex = isDragging ? tabs.findIndex(t => t.id === draggingTabId.current) : -1;
                            const visualDropIndex = (dropIndex !== null && draggingIndex !== -1 && dropIndex > draggingIndex) ? dropIndex + 1 : dropIndex;
                            return (
                                <>
                                    {tabs.map((tab, i) => (
                                        <React.Fragment key={tab.id}>
                                            {visualDropIndex === i && <div className="w-0.5 h-5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] rounded-full mx-0.5 shrink-0 z-50 animate-pulse" />}
                                            <div
                                                key={tab.id}
                                                ref={(el) => { if (el) tabRefs.current[tab.id] = el; }}
                                                onMouseDown={(e) => { draggingTabId.current = tab.id; handleMouseDown(e, 'tab', tab.id); }}
                                                onClick={() => setActiveTabId(tab.id)}
                                                onContextMenu={(e) => handleContextMenu(e, 'tab', tab.id)}
                                                className={`
                            group relative px-4 py-2 text-xs font-mono border-t border-l border-r rounded-t-lg flex items-center gap-2 cursor-pointer select-none min-w-[120px] max-w-[200px] shrink-0
                            ${activeTabId === tab.id ? 'bg-[var(--bg-panel)] border-[var(--border)] border-b-[var(--bg-panel)] text-[var(--text-primary)] z-10' : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-activity)]/50'}
                            ${isDragging && draggingTabId.current === tab.id ? 'opacity-40 grayscale' : 'opacity-100'}
                          `}
                                            >
                                                {(() => {
                                                    const { icon: Icon, color } = getFileIcon(tab.title);
                                                    return <Icon size={12} className={color} />;
                                                })()}
                                                <span className="truncate flex-1">{tab.title}</span>
                                                {tab.id !== 'home' && <X size={12} className="opacity-0 group-hover:opacity-100 hover:text-red-400" onClick={(e) => closeTab(e, tab.id)} />}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                    {visualDropIndex === tabs.length && <div className="w-0.5 h-5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] rounded-full mx-0.5 shrink-0 z-50 animate-pulse" />}
                                </>
                            );
                        })()}
                        {dropIndex === tabs.length && <div className="w-0.5 h-5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] rounded-full mx-0.5 shrink-0 z-50 animate-pulse" />}
                    </div>
                    <div
                        ref={editorScrollRef}
                        onScroll={(e) => { scrollPositions.current[activeTabId] = e.currentTarget.scrollTop; }}
                        className="flex-1 bg-[var(--bg-panel)] relative overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent custom-scrollbar transition-colors duration-300"
                    >
                        {tabs.map(tab => (
                            <div key={tab.id} className={`h-full w-full ${activeTabId === tab.id ? 'block' : 'hidden'}`}>
                                <ContentRenderer
                                    type={tab.type}
                                    data={tab.data}
                                    title={tab.title}
                                    content={tab.content}
                                    lang={tab.lang}
                                    onOpenFile={openFile}
                                    editorSettings={editorSettings}
                                />


                            </div>
                        ))}
                        {tabs.length === 0 && <div className="h-full flex items-center justify-center text-[var(--text-secondary)] font-mono text-sm">No active files.</div>}
                    </div>
                    <div className="h-6 bg-[#007acc] md:bg-[var(--bg-activity)] border-t border-[var(--border)] flex justify-between items-center px-3 text-[10px] md:text-xs font-mono text-[var(--text-secondary)] z-30 relative shrink-0 transition-colors duration-300 select-none">

                        {/* LEFT SIDE */}
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                                className="flex items-center gap-1 hover:text-white cursor-pointer hover:bg-slate-800 px-2 rounded transition-colors"
                            >
                                <Terminal size={10} />
                                <span className="hidden sm:inline">TERMINAL</span>
                            </button>

                            <div className="hidden md:flex items-center gap-1 hover:text-white cursor-pointer">
                                <GitBranch size={10} />
                                <span>main*</span>
                            </div>

                            <div className="hidden md:flex items-center gap-1 hover:text-white cursor-pointer">
                                <AlertCircle size={10} />
                                <span>0 errors</span>
                            </div>
                        </div>

                        {/* RIGHT SIDE (DESKTOP ONLY) */}
                        <div className="hidden md:flex gap-4 items-center">
                            <span className="hover:text-white cursor-pointer">Ln 12, Col 45</span>
                            <span className="hover:text-white cursor-pointer">UTF-8</span>
                            <span className="hover:text-white cursor-pointer text-emerald-500 flex items-center gap-1">
                                <CheckCircle size={10} /> Prettier
                            </span>
                            <span className="hover:text-white cursor-pointer text-blue-400 flex items-center gap-1">
                                <Bell size={10} />
                            </span>
                        </div>

                    </div>

                </div>
                {windows.map(win => (
                    <div
                        key={win.id}
                        style={{ position: 'absolute', left: win.position.x, top: win.position.y, width: win.size.w, height: win.size.h, zIndex: win.zIndex || 40 }}
                        onMouseDown={(e) => handleMouseDown(e, 'focus', win.id)}
                        className="bg-[var(--bg-main)] border border-[var(--border)] rounded-lg shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/50"
                    >
                        <div
                            className="h-8 bg-[var(--bg-activity)] border-b border-[var(--border)]
             flex justify-between items-center px-2
             cursor-grab active:cursor-grabbing select-none"
                            onMouseDown={(e) => {
                                e.preventDefault();        // 🔥 stops selection instantly
                                e.stopPropagation();
                                handleMouseDown(e, 'window', win.id);
                            }}
                            onDoubleClick={(e) => toggleMaximize(e, win.id)}
                        >

                            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
                                <GripHorizontal size={12} />
                                {(() => {
                                    const { icon: Icon, color } = getFileIcon(win.title);
                                    return <><Icon size={12} className={color} /><span>{win.title}</span></>;
                                })()}
                            </div>
                            <div className="flex items-center gap-1.5" onMouseDown={(e) => e.stopPropagation()}>
                                <div className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-panel)]/50 rounded cursor-pointer transition-colors" onClick={(e) => toggleMaximize(e, win.id)} title={win.isMaximized ? "Restore" : "Maximize"}>
                                    {win.isMaximized ? <Minimize2 size={13} /> : <Square size={13} />}
                                </div>
                                <div className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-red-500/80 rounded cursor-pointer transition-colors" onClick={(e) => closeWindow(e, win.id)} title="Close">
                                    <X size={14} />
                                </div>
                            </div>
                        </div>
                        <div
                            onScroll={(e) => { scrollPositions.current[win.id] = e.currentTarget.scrollTop; }}
                            ref={(el) => { if (!el) return; el.scrollTop = scrollPositions.current[win.id] ?? 0; }}
                            className="flex-1 bg-[var(--bg-panel)] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-700 custom-scrollbar"
                        >
                            <ContentRenderer
                                type={win.type}
                                data={win.data}
                                title={win.title}   // ✅ REQUIRED
                                content={win.content}
                                lang={win.lang}
                                onOpenFile={openFile}
                                editorSettings={editorSettings}
                            />
                        </div>
                        {!win.isMaximized && (
                            <>
                                {/* Top-left */}
                                <div
                                    className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'nw' });
                                    }}
                                />

                                {/* Top-right */}
                                <div
                                    className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'ne' });
                                    }}
                                />

                                {/* Bottom-left */}
                                <div
                                    className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'sw' });
                                    }}
                                />

                                {/* Bottom-right */}
                                <div
                                    className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'se' });
                                    }}
                                />
                            </>

                        )}
                    </div>
                ))}
                <IntegratedTerminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} onOpenFile={openFile} />
                <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} onOpenFile={openFile} />
                {isDragging && dragItem.current?.type === 'tab' && (
                    <div style={{ position: 'fixed', left: mousePos.x + 10, top: mousePos.y + 10, zIndex: 9999, pointerEvents: 'none' }} className="bg-[var(--bg-panel)] border border-indigo-500/50 text-[var(--text-primary)] text-xs font-mono px-4 py-2 rounded shadow-2xl opacity-80 ">
                        {tabs.find(t => t.id === dragItem.current.id)?.title}
                    </div>
                )}
            </div>
        </ThemeContext.Provider>
    );
};

export default App;