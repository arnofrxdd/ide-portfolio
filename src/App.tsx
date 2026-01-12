import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Github, ExternalLink, X, ChevronRight, ChevronDown,
  Code, Terminal, Database, Cpu, Globe, ArrowLeft,
  Send, Maximize2, Minimize2, GripHorizontal,
  FileCode, FileJson, FileText, Folder, FolderOpen,
  GitBranch, CheckCircle, Zap, Layout, Command,
  AlertCircle, Activity, Server, Lock, Layers,
  Play, Pause, RefreshCw, Box, Shield, Clock, HardDrive,
  Search, Settings, User, File, ToggleLeft, ToggleRight,
  Filter,
  Download, Trash2, Plus, MoreHorizontal as MoreHorizontalIcon,
  Menu, Smartphone, Tablet, Square, Copy, Coffee, Bell, Wifi, Eye, Edit3
} from 'lucide-react';

import { PROJECTS_DATA } from "./data/projects";

/* --- CONFIGURATION & DATA --- */

const SYSTEM_PROMPT = `
You are a CLI Assistant for Arnav's Portfolio. 
Answer purely in text/markdown suitable for a terminal window.
Keep responses concise, technical, and cool.
Data Context:
`;


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

/* --- UTILITIES --- */
const getTechColorStyles = (tech) => {
  const map = {
    // Frontend
    "React": "text-cyan-400 border-cyan-400/30 bg-cyan-950/30",
    "Vue": "text-emerald-400 border-emerald-400/30 bg-emerald-950/30",
    "Next.js": "text-slate-200 border-slate-400/30 bg-slate-900/40",
    "Tailwind": "text-cyan-300 border-cyan-400/30 bg-cyan-950/20",
    "HTML": "text-orange-400 border-orange-400/30 bg-orange-950/30",
    "CSS": "text-blue-300 border-blue-400/30 bg-blue-950/30",
    "Chart.js": "text-pink-400 border-pink-400/30 bg-pink-950/30",

    // Backend
    "Node.js": "text-green-500 border-green-500/30 bg-green-950/30",
    "Express": "text-lime-400 border-lime-400/30 bg-lime-950/30",
    "TypeScript": "text-blue-400 border-blue-400/30 bg-blue-950/30",
    "Python": "text-yellow-400 border-yellow-400/30 bg-yellow-950/30",
    "Go": "text-sky-400 border-sky-400/30 bg-sky-950/30",
    "Java": "text-red-400 border-red-400/30 bg-red-950/30",

    // Databases
    "MongoDB": "text-green-400 border-green-400/30 bg-green-950/30",
    "PostgreSQL": "text-indigo-400 border-indigo-400/30 bg-indigo-950/30",
    "MySQL": "text-blue-400 border-blue-400/30 bg-blue-950/30",
    "Redis": "text-red-400 border-red-400/30 bg-red-950/30",

    // Cloud & Infra
    "Oracle Cloud": "text-red-300 border-red-400/30 bg-red-950/20",
    "AWS": "text-orange-300 border-orange-400/30 bg-orange-950/20",
    "Docker": "text-sky-400 border-sky-400/30 bg-sky-950/30",
    "Nginx": "text-emerald-400 border-emerald-400/30 bg-emerald-950/30",
    "systemd": "text-slate-200 border-slate-400/30 bg-slate-800/50",

    // Networking / Security
    "Xray": "text-fuchsia-400 border-fuchsia-400/30 bg-fuchsia-950/30",
    "VLESS": "text-purple-400 border-purple-400/30 bg-purple-950/30",
    "noVNC": "text-teal-400 border-teal-400/30 bg-teal-950/30",
    "WebSockets": "text-indigo-300 border-indigo-400/30 bg-indigo-950/30",
    "TCP": "text-slate-300 border-slate-500/30 bg-slate-800/40",
    "REST API": "text-blue-300 border-blue-400/30 bg-blue-950/30",

    // Messaging / Streaming
    "Kafka": "text-slate-200 border-slate-400/30 bg-slate-800/50",
    // Desktop / Native
    "Win32 API": "text-sky-300 border-sky-400/30 bg-sky-950/30",
    "Raw Input": "text-indigo-300 border-indigo-400/30 bg-indigo-950/30",
    "UI Automation": "text-purple-300 border-purple-400/30 bg-purple-950/30",
    "Electron": "text-cyan-300 border-cyan-400/30 bg-cyan-950/30",

    // Frontend / UI
    "React Router": "text-blue-300 border-blue-400/30 bg-blue-950/30",
    "Framer Motion": "text-pink-400 border-pink-400/30 bg-pink-950/30",
    "CSS Animations": "text-rose-300 border-rose-400/30 bg-rose-950/30",

    // Backend / APIs
    "Express.js": "text-lime-400 border-lime-400/30 bg-lime-950/30",
    "OS Module": "text-slate-300 border-slate-400/30 bg-slate-800/40",
    "Telegram Bot API": "text-sky-400 border-sky-400/30 bg-sky-950/30",
    "Web Scraping": "text-amber-400 border-amber-400/30 bg-amber-950/30",

    // Networking / Security
    "Xray Core": "text-fuchsia-400 border-fuchsia-400/30 bg-fuchsia-950/30",
    "VLESS": "text-violet-400 border-violet-400/30 bg-violet-950/30",
    "Reality (XTLS Vision)": "text-purple-400 border-purple-400/30 bg-purple-950/30",

    // Cloud / Infra
    "Oracle Cloud Infrastructure": "text-red-300 border-red-400/30 bg-red-950/20",
    "noVNC": "text-teal-400 border-teal-400/30 bg-teal-950/30",
    "VNC Server": "text-emerald-300 border-emerald-400/30 bg-emerald-950/30",

    // Browser / Extensions
    "Chrome Extensions": "text-yellow-300 border-yellow-400/30 bg-yellow-950/30",
    "DOM MutationObserver": "text-indigo-300 border-indigo-400/30 bg-indigo-950/30",

    // Low-level / Advanced
    "Reverse Engineering": "text-red-400 border-red-400/30 bg-red-950/30",
    "Multithreading": "text-orange-300 border-orange-400/30 bg-orange-950/30",

    // Python / Desktop
    "Python": "text-yellow-400 border-yellow-400/30 bg-yellow-950/30",
    "PyQt5": "text-green-300 border-green-400/30 bg-green-950/30",

    // Tooling
    "Git": "text-orange-400 border-orange-400/30 bg-orange-950/30",
    "GitHub": "text-slate-200 border-slate-400/30 bg-slate-800/40",
    "Shell": "text-green-300 border-green-400/30 bg-green-950/20",
    "Linux": "text-yellow-300 border-yellow-400/30 bg-yellow-950/20",
    "JSON": "text-slate-300 border-slate-400/30 bg-slate-800/40",
  };

  return map[tech] || "text-slate-300 border-slate-600/30 bg-slate-800/30";
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

// Live Clock Component
const LiveStatus = () => {
  const [time, setTime] = useState(new Date());
  const [latency, setLatency] = useState(24);
  const [mem, setMem] = useState(450);

  useEffect(() => {
    // Clock tick
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Fake fluctuations for latency and memory
    const metricsTimer = setInterval(() => {
      setLatency(prev => Math.max(10, Math.min(150, prev + Math.floor(Math.random() * 20) - 10)));
      setMem(prev => Math.max(200, Math.min(1024, prev + Math.floor(Math.random() * 50) - 20)));
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(metricsTimer);
    };
  }, []);

  return (
    <div className="flex items-center gap-4 text-[10px] md:text-xs text-slate-500 font-mono">
      <span className="flex items-center gap-1.5 hidden sm:flex">
        <Wifi size={10} className={latency > 100 ? 'text-red-400' : 'text-emerald-400'} />
        <span>{latency}ms</span>
      </span>
      <span className="flex items-center gap-1.5 hidden sm:flex">
        <Cpu size={10} className="text-blue-400" />
        <span>{mem}MB</span>
      </span>
      <span className="flex items-center gap-1.5 text-slate-300">
        <Clock size={10} />
        <span>{time.toLocaleTimeString()}</span>
      </span>
    </div>
  );
};

// Toast Component
const ToastContainer = ({ toasts }) => {
  return (
    <div className="fixed bottom-12 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            min-w-[200px] max-w-sm bg-[#1e293b] border-l-4 p-3 rounded shadow-xl animate-in slide-in-from-right-full fade-in duration-300
            ${toast.type === 'success' ? 'border-emerald-500 text-emerald-100' :
              toast.type === 'error' ? 'border-red-500 text-red-100' :
                toast.type === 'warning' ? 'border-amber-500 text-amber-100' :
                  'border-blue-500 text-blue-100'}
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
      ctx.fillStyle = '#1e293b';
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
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent; 
    }
    ::-webkit-scrollbar-thumb {
      background: #334155; 
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #475569; 
    }
    ::-webkit-scrollbar-corner {
      background: transparent;
    }
    @keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

    /* Firefox */
    * {
      scrollbar-width: thin;
      scrollbar-color: #334155 transparent;
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
  onToggle
}) => (
  <div
    onClick={() => {
      if (hasChildren) {
        onToggle();
      } else {
        onClick?.();
      }
    }}
    className={`
    flex items-center py-1 px-3 cursor-pointer select-none transition-colors
    ${isActive
        ? 'bg-slate-800 text-white'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}
  `}
    style={{ paddingLeft: `${depth * 12 + 12}px` }}
  >

    {/* Chevron / spacer — fixed width */}
    {hasChildren ? (
      <div
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className="p-0.5 hover:bg-slate-700 rounded shrink-0"
      >
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </div>
    ) : (
      <span className="w-4 shrink-0" />
    )}

    {/* Icon + filename wrapper (THIS IS THE KEY) */}
    <div className="flex items-center gap-1.5 min-w-0 flex-1">
      <Icon size={14} className={`${color} shrink-0`} />
      <span className="text-xs font-mono truncate min-w-0 flex-1">
        {name}
      </span>
    </div>
  </div>
);


const Sidebar = ({ onOpenFile, onToast }) => {
  const [activeView, setActiveView] = useState('explorer');
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState({
    'src': true,
    'components': false,
    'pages': true,

    'projects': false,
    'recruiter': true
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [stagedFiles, setStagedFiles] = useState(['resume_old.pdf', 'resume_new.pdf']);
  const [installedExtensions, setInstalledExtensions] = useState({
    "React IntelliSense": true,
    "TypeScript Importer": true,
    "Tailwind CSS": true,
    "Go Tools": false,
    "Python": false
  });
  const [settings, setSettings] = useState({
    "Word Wrap": true,
    "Minimap": false,
    "Format On Save": true,
    "Auto Save": false
  });

  // Mobile Check: Collapse sidebar by default only on mobile
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
  };

  const toggleSetting = (key) => {
    const val = !settings[key];
    setSettings(prev => ({ ...prev, [key]: val }));
    if (key === 'Format On Save') {
      onToast(val ? "Prettier formatting enabled." : "Chaos mode enabled.", 'info');
    } else if (key === 'Auto Save') {
      onToast(val ? "Auto-save active. Don't worry." : "Auto-save off. Good luck.", val ? 'success' : 'warning');
    } else {
      onToast(`${key} changed.`, 'info');
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
    // setTimeout(() => onToast("Just kidding, it's a simulation.", "info"), 3000);
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
    <div className="flex h-full border-r border-slate-800/50 bg-[#0a0a0c] z-30 relative shrink-0">

      {/* ACTIVITY BAR (Far Left) */}
      <div className="w-12 flex flex-col items-center py-4 border-r border-slate-800/50 bg-[#0a0a0c] gap-6 z-30 relative">
        <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'explorer' && isPanelVisible ? 'text-white border-l-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => handleActivityClick('explorer')} title="Explorer">
          <FileCode size={20} />
        </div>
        <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'search' && isPanelVisible ? 'text-white border-l-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => handleActivityClick('search')} title="Search">
          <Search size={20} />
        </div>
        <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'git' && isPanelVisible ? 'text-white border-l-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => handleActivityClick('git')} title="Source Control">
          <GitBranch size={20} />
        </div>
        <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'extensions' && isPanelVisible ? 'text-white border-l-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => handleActivityClick('extensions')} title="Extensions">
          <Box size={20} />
        </div>

        <div className="mt-auto flex flex-col gap-6">
          <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'account' && isPanelVisible ? 'text-white border-l-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => handleActivityClick('account')} title="Account"><User size={20} /></div>
          <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'settings' && isPanelVisible ? 'text-white border-l-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`} onClick={() => handleActivityClick('settings')} title="Settings"><Settings size={20} /></div>
        </div>
      </div>

      {/* SIDEBAR PANEL CONTENT - Responsive */}
      {/* On desktop: Relative (pushes content). On mobile: Absolute/Fixed (overlay). */}
      <div className={`
        flex flex-col bg-[#0a0a0c] border-r border-slate-800/50
        fixed md:relative top-0 bottom-0 left-12 md:left-0 z-20
        w-60 transition-transform duration-300 ease-in-out
        ${isPanelVisible ? 'translate-x-0' : '-translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden md:border-none'}
      `}>

        {/* EXPLORER VIEW */}
        {activeView === 'explorer' && (
          <div className="flex-1 flex flex-col min-h-0 min-w-[15rem]">
            <div className="h-9 px-4 flex items-center justify-between text-xs font-bold text-slate-400 tracking-wider">
              <span>EXPLORER</span>
              <div className="flex gap-2">
                <MoreHorizontalIcon size={14} className="hover:text-white cursor-pointer" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
              <div className="px-4 mb-2 flex items-center gap-1 text-indigo-400 font-bold text-xs"><ChevronDown size={12} /> <span>PORTFOLIO</span></div>

              {/* Folders */}
              <FileTreeItem
                depth={0} name="src" icon={expandedFolders['src'] ? FolderOpen : Folder} color="text-indigo-400"
                hasChildren isOpen={expandedFolders['src']} onToggle={() => toggleFolder('src')}
              />

              {expandedFolders['src'] && (
                <>
                  <FileTreeItem
                    depth={1} name="projects" icon={expandedFolders['projects'] ? FolderOpen : Folder} color="text-emerald-400"
                    hasChildren isOpen={expandedFolders['projects']} onToggle={() => toggleFolder('projects')}
                  />
                  {expandedFolders['projects'] && (
                    PROJECTS_DATA.map(p => (
                      <FileTreeItem
                        key={p.id}
                        depth={2}
                        name={`${p.title}.tsx`}
                        icon={FileCode}
                        color="text-emerald-300"
                        onClick={() => onOpenFile({ id: p.id, title: `${p.title}.tsx`, type: 'detail', data: p })}
                      />
                    ))
                  )}

                  <FileTreeItem
                    depth={1} name="pages" icon={expandedFolders['pages'] ? FolderOpen : Folder} color="text-amber-400"
                    hasChildren isOpen={expandedFolders['pages']} onToggle={() => toggleFolder('pages')}
                  />
                  {expandedFolders['pages'] && (
                    <>
                      <FileTreeItem depth={2} name="home.tsx" icon={FileCode} color="text-sky-400" onClick={() => onOpenFile({ id: 'home', title: 'home.tsx', type: 'home' })} />
                      <FileTreeItem
                        depth={2}
                        name="projects.tsx"
                        icon={FileCode}
                        color="text-sky-400"
                        onClick={() =>
                          onOpenFile({
                            id: 'projects_tsx',
                            title: 'projects.tsx',
                            type: 'projects'
                          })
                        }
                      />
                      <FileTreeItem
                        depth={2}
                        name="projects.json"
                        icon={FileJson}
                        color="text-emerald-400"
                        onClick={() =>
                          onOpenFile({
                            id: 'projects_json',
                            title: 'projects.json',
                            type: 'code',
                            content: FILE_CONTENTS.projects_json,
                            lang: 'json'
                          })
                        }
                      />
                    </>

                  )}

                  <FileTreeItem
                    depth={1} name="components" icon={expandedFolders['components'] ? FolderOpen : Folder} color="text-emerald-400"
                    hasChildren isOpen={expandedFolders['components']} onToggle={() => toggleFolder('components')}
                  />
                  {expandedFolders['components'] && (
                    <>
                      <FileTreeItem depth={2} name="Terminal.tsx" icon={FileCode} color="text-sky-400" onClick={() => onOpenFile({ id: 'terminal_comp', title: 'Terminal.tsx', type: 'code', content: FILE_CONTENTS.terminal_component, lang: 'typescript' })} />
                      <FileTreeItem depth={2} name="Window.tsx" icon={FileCode} color="text-sky-400" onClick={() => onOpenFile({ id: 'window_comp', title: 'Window.tsx', type: 'code', content: FILE_CONTENTS.window_component, lang: 'typescript' })} />
                    </>
                  )}
                </>
              )}

              {/* Root Files */}
              <FileTreeItem depth={0} name=".env" icon={Lock} color="text-yellow-500" onClick={() => onOpenFile({ id: 'env', title: '.env', type: 'code', content: FILE_CONTENTS.env, lang: 'bash' })} />
              <FileTreeItem depth={0} name=".gitignore" icon={FileText} color="text-slate-500" onClick={() => onOpenFile({ id: 'gitignore', title: '.gitignore', type: 'code', content: FILE_CONTENTS.gitignore, lang: 'bash' })} />
              <FileTreeItem depth={0} name="package.json" icon={FileJson} color="text-red-400" onClick={() => onOpenFile({ id: 'package', title: 'package.json', type: 'package' })} />
              <FileTreeItem depth={0} name="README.md" icon={FileText} color="text-blue-400" onClick={() => onOpenFile({ id: 'readme', title: 'README.md', type: 'readme' })} />

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
                  <FileTreeItem
                    depth={1}
                    name="hire_me.json"
                    icon={FileJson}
                    color="text-emerald-300"
                    onClick={() =>
                      onOpenFile({
                        id: 'hire_me',
                        title: 'recruiter/hire_me.json',
                        type: 'code',
                        content: FILE_CONTENTS.hire_me,
                        lang: 'json'
                      })
                    }
                  />

                  <FileTreeItem
                    depth={1}
                    name="skills.json"
                    icon={FileJson}
                    color="text-indigo-300"
                    onClick={() =>
                      onOpenFile({
                        id: 'skills_json',
                        title: 'recruiter/skills.json',
                        type: 'code',
                        content: FILE_CONTENTS.skills_json,
                        lang: 'json'
                      })
                    }
                  />

                  <FileTreeItem
                    depth={1}
                    name="career_path.txt"
                    icon={FileText}
                    color="text-purple-300"
                    onClick={() =>
                      onOpenFile({
                        id: 'career_path',
                        title: 'recruiter/career_path.txt',
                        type: 'code',
                        content: FILE_CONTENTS.career_path,
                        lang: 'text'
                      })
                    }
                  />

                </>
              )}

            </div>
          </div>
        )}

        {/* SEARCH VIEW */}
        {activeView === 'search' && (
          <div className="flex-1 flex flex-col p-4 min-w-[15rem]">
            <div className="text-xs font-bold text-slate-400 mb-4 tracking-wider">SEARCH</div>
            <div className="relative mb-4">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-xs p-2 pl-8 rounded focus:outline-none focus:border-indigo-500"
              />
              <Search size={12} className="absolute left-2.5 top-2.5 text-slate-500" />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {searchQuery && filteredProjects.map(p => (
                <div key={p.id} onClick={() => onOpenFile({ id: p.id, title: `${p.title}.tsx`, type: 'detail', data: p })} className="group cursor-pointer mb-3 hover:bg-slate-800/50 p-2 rounded">
                  <div className="flex items-center gap-2 text-xs text-slate-300 group-hover:text-indigo-400 font-mono mb-1">
                    <FileCode size={12} /> {p.title}.tsx
                  </div>
                  <div className="text-[10px] text-slate-500 pl-5 line-clamp-2">{p.description}</div>
                </div>
              ))}
              {searchQuery && filteredProjects.length === 0 && <div className="text-xs text-slate-500 text-center mt-4">No results found.</div>}
              {!searchQuery && <div className="text-xs text-slate-600 text-center mt-10">Type to search across all files and projects.</div>}
            </div>
          </div>
        )}

        {/* GIT VIEW */}
        {activeView === 'git' && (
          <div className="flex-1 flex flex-col p-4 min-w-[15rem]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-bold text-slate-400 tracking-wider">SOURCE CONTROL</div>
              <div className="flex gap-2">
                <div className="text-slate-500 hover:text-white cursor-pointer"><RefreshCw size={12} /></div>
              </div>
            </div>

            <div className="text-xs text-slate-300 font-mono mb-2 flex items-center gap-2">
              <ChevronDown size={12} /> <span>Changes</span> <span className="bg-slate-800 px-1.5 rounded-full text-[10px]">{stagedFiles.length}</span>
            </div>

            <div className="space-y-1">
              {stagedFiles.map(file => (
                <div key={file} className="flex items-center gap-2 py-1 px-2 hover:bg-slate-800 rounded cursor-pointer group">
                  <FileText size={14} className="text-yellow-500" />
                  <span className="text-xs text-slate-400 group-hover:text-slate-200">{file}</span>
                  <span onClick={() => stageFile(file)} className="text-[10px] text-slate-500 hover:text-green-400 ml-auto flex items-center gap-1">
                    <Plus size={10} />
                  </span>
                </div>
              ))}
              {stagedFiles.length === 0 && <div className="text-xs text-slate-500 italic pl-2">All changes staged.</div>}
            </div>

            <div className="mt-6">
              <input placeholder="Message (Ctrl+Enter)" className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-xs p-2 rounded focus:outline-none focus:border-indigo-500" />
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
            <div className="text-xs font-bold text-slate-400 mb-4 tracking-wider">EXTENSIONS</div>

            <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
              {Object.entries(installedExtensions).map(([name, installed], i) => (
                <div key={i} className="flex gap-3 hover:bg-slate-800/50 p-2 rounded cursor-default group">
                  <div className="w-8 h-8 bg-indigo-900/50 text-indigo-400 flex items-center justify-center rounded shrink-0">
                    <Box size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs font-bold text-slate-200 truncate">{name}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleExtension(name)}
                        className={`text-[9px] px-1.5 py-0.5 rounded border ${installed ? 'bg-slate-800 border-slate-600 text-slate-400' : 'bg-indigo-600 border-indigo-500 text-white'}`}
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
            <div className="text-xs font-bold text-slate-400 mb-4 tracking-wider">SETTINGS</div>
            <div className="space-y-4">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between group">
                  <span className="text-xs text-slate-300">{key}</span>
                  <button onClick={() => toggleSetting(key)} className={`text-slate-400 hover:text-white`}>
                    {value ? <ToggleRight size={24} className="text-indigo-400" /> : <ToggleLeft size={24} />}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800">
              <button className="text-xs text-slate-400 hover:text-white flex items-center gap-2 mb-3">
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
            <h3 className="text-sm font-bold text-white">Arnav</h3>
            <p className="text-xs text-slate-500 mb-6">Full Stack Engineer</p>

            <div className="w-full space-y-2">
              <button onClick={handleEditProfile} className="w-full py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded">Edit Profile</button>
              <button onClick={handleSignOut} className="w-full py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded">Sign Out</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

/* --- INTEGRATED TERMINAL (Updated for Mobile) --- */
const IntegratedTerminal = ({ isOpen, onClose, onOpenFile }) => {
  const [history, setHistory] = useState([
    { type: 'system', content: 'Gemini Shell v2.5.0' },
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
    if (isOpen && inputRef.current) {
      // Slight delay to allow transition to finish on mobile
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleCommand = async () => {
    const cmd = input.trim();
    if (!cmd) return;

    setHistory(prev => [...prev, { type: 'user', content: cmd }]);
    setInput("");
    setIsProcessing(true);

    const args = cmd.split(' ');
    const command = args[0].toLowerCase();

    if (command === 'help') {
      setTimeout(() => {
        setHistory(prev => [...prev, {
          type: 'output', content:
            `Available Commands:
  ls              List all projects
  open <name>     Open project details
  cat <name>      Print project summary
  clear           Clear terminal history
  whoami          Print current user info
  <query>         Ask Gemini AI anything`
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
      const aiResponse = await generateGeminiResponse(cmd);
      setHistory(prev => [...prev, { type: 'output', content: aiResponse }]);
    } catch (e) {
      setHistory(prev => [...prev, { type: 'error', content: "Error connecting to AI." }]);
    } finally {
      setIsProcessing(false);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }

  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[40vh] md:h-80 bg-[#0a0a0c] border-t border-slate-700 z-50 flex flex-col shadow-[0_-5px_20px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-300">
      <div className="h-8 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-4 select-none flex-shrink-0">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
          <Terminal size={12} />
          <span>GEMINI TERMINAL</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-slate-500 font-mono hidden md:inline">Node v20.1.0</span>
          <button onClick={onClose} className="hover:text-white text-slate-500 transition-colors">
            <Minimize2 size={14} />
          </button>
          <button onClick={onClose} className="hover:text-red-400 text-slate-500 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs md:text-sm bg-[#0a0a0c] scrollbar-thin scrollbar-thumb-slate-700 custom-scrollbar"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line, i) => (
          <div key={i} className="mb-1 whitespace-pre-wrap break-words">
            {line.type === 'user' && (
              <div className="flex gap-2 text-slate-300">
                <span className="text-emerald-500">➜</span>
                <span className="text-blue-400">~</span>
                <span>{line.content}</span>
              </div>
            )}
            {line.type === 'system' && <div className="text-slate-500 italic">{line.content}</div>}
            {line.type === 'output' && <div className="text-slate-300 ml-4">{line.content}</div>}
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
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (!isProcessing) handleCommand();
                }
              }}
              className="w-full bg-transparent border-none outline-none text-slate-200 placeholder-slate-700 caret-slate-200 text-sm"
              autoComplete="off"
            />

            {isProcessing && (
              <div className="absolute top-0 right-0">
                <div className="h-4 w-2 bg-slate-500 animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- CONTENT RENDERER (Updated) --- */

const ContentRenderer = ({ type, data, onOpenFile, content, lang }) => {
  // New: Generic Code Viewer
  if (type === 'code') {
    return (
      <div className="p-4 md:p-12 max-w-4xl mx-auto h-full overflow-hidden flex flex-col">
        <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2 font-mono">
          <Code size={20} className="text-indigo-400" /> {data ? data.title : 'Code Viewer'}
        </h2>
        <div className="bg-[#0f0f11] border border-slate-800 rounded-lg p-6 flex-1 overflow-auto custom-scrollbar">
          <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">
            {content || "No content."}
          </pre>
        </div>
      </div>
    );
  }

  // --- EXISTING RENDERERS ---
  if (type === 'home') {
    const featuredProjects = PROJECTS_DATA.filter(p => p.featured);
    const recentActivity = [
      { action: "Shipped feature update for", target: "MouseShifter", time: "2h ago" },
      { action: "Refactored input pipeline in", target: "MouseShifter", time: "6h ago" },
      { action: "Deployed full-stack app on", target: "Vercel", time: "1d ago" },
      { action: "Debugged networking issue in", target: "proxy_tunnel", time: "2d ago" },
    ];


    // Helper to generate text on grid
    const getDotActive = (col, row) => {
      // H: col 0-4
      if (col === 0 || col === 4) return true;
      if (row === 3 && col > 0 && col < 4) return true;

      // E: col 6-10
      if (col === 6) return true;
      if ((row === 0 || row === 3 || row === 6) && col >= 6 && col <= 9) return true;

      // L: col 12-16
      if (col === 12) return true;
      if (row === 6 && col >= 12 && col <= 15) return true;

      // L: col 18-22
      if (col === 18) return true;
      if (row === 6 && col >= 18 && col <= 21) return true;

      // O: col 24-28
      if (col === 24 || col === 28) return row !== 0 && row !== 6;
      if (row === 0 || row === 6) return col > 24 && col < 28;

      return false;
    };

    return (
      <div className="p-4 md:p-12 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-20">

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <span className="text-slate-500 font-mono text-sm block mb-2">// Initializing Portfolio System...</span>
            <h1 className="text-3xl md:text-6xl font-bold text-slate-100 tracking-tight mb-4">
              <span className="mr-3">Hello, I'm</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                <TypingEffect text="Arnav" speed={150} />
              </span>
              <span className="ml-1 text-cyan-400 animate-[blink_1s_steps(1)_infinite]">_</span>
            </h1>
          </div>
        </div>

        {/* JSON Status - Restored */}
        <div className="pl-4 md:pl-6 border-l-2 border-slate-800 space-y-4 font-mono text-xs md:text-base mb-12">
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

        {/* Pinned Deployments - Moved Up */}
        <div className="mb-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-200 mb-6 flex items-center gap-2 font-mono">
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
                className="bg-[#0f0f11] border border-slate-800 hover:border-indigo-500/50 rounded-lg p-5 cursor-pointer hover:-translate-y-1 transition-all group shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileCode size={16} className="text-indigo-400" />
                    <span className="text-slate-300 font-mono text-sm font-semibold truncate max-w-[150px]">
                      {p.title}
                    </span>
                  </div>
                  <ExternalLink size={12} className="text-slate-600 group-hover:text-white" />
                </div>

                <p className="text-slate-500 text-xs line-clamp-2 mb-4 h-8">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>


        {/* Action Buttons - Moved Below Deployments */}
        <div className="mb-12 flex flex-wrap gap-4">
          <button
            onClick={() =>
              onOpenFile({
                id: 'projects_tsx',
                title: 'projects.tsx',
                type: 'projects'
              })
            }
            className="
    flex items-center gap-2
    px-4 py-2
    bg-[#0a0a0c]
    border border-slate-700
    text-slate-300
    font-mono text-xs
    rounded
    hover:border-indigo-500
    hover:text-indigo-400
    transition-all
  "
          >
            <Terminal size={14} />
            <span>./view_all_projects</span>
          </button>


        </div>

        {/* Contribution Graph - With Text */}
        <div className="mb-12">
          <h2 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2 font-mono uppercase tracking-wider">
            <Activity size={14} className="text-emerald-500" /> Contribution Map
          </h2>
          <div className="bg-[#0a0a0c] border border-slate-800 p-4 rounded-lg overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {Array.from({ length: 50 }).map((_, col) => (
                <div key={col} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, row) => {
                    // Shift text start to column 2
                    const isText = getDotActive(col - 2, row);
                    // Add some random noise
                    const isRandom = Math.random() > 0.92;

                    let color = 'bg-slate-800';
                    if (isText) color = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]';
                    else if (isRandom) color = 'bg-emerald-900/50';

                    return <div key={row} className={`w-2.5 h-2.5 rounded-sm ${color} transition-all duration-500 hover:scale-125`} />
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mb-12">
          <h2 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2 font-mono uppercase tracking-wider">
            <GitBranch size={14} className="text-blue-500" /> Recent Activity
          </h2>
          <div className="space-y-2">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex items-center justify-between text-sm bg-slate-900/20 border border-slate-800/50 p-3 rounded hover:border-slate-700 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-slate-400 font-mono">{act.action} <span className="text-indigo-300 font-bold group-hover:underline cursor-pointer">{act.target}</span></span>
                </div>
                <span className="text-xs text-slate-600 font-mono">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'projects') {
    const [showFilters, setShowFilters] = useState(false);
    const [techFilters, setTechFilters] = useState([]);
    const [langFilters, setLangFilters] = useState([]);

    // 🔍 Collect unique tech + languages from projects
    const allTech = Array.from(
      new Set(PROJECTS_DATA.flatMap(p => p.tech || []))
    ).sort();

    const allLanguages = Array.from(
      new Set(
        PROJECTS_DATA.flatMap(p =>
          (p.languages || []).map(l => l.name)
        )
      )
    ).sort();

    // 🎯 Filter logic
    const filteredProjects = PROJECTS_DATA.filter(p => {
      const techMatch =
        techFilters.length === 0 ||
        p.tech?.some(t => techFilters.includes(t));

      const langMatch =
        langFilters.length === 0 ||
        p.languages?.some(l => langFilters.includes(l.name));

      return techMatch && langMatch;
    });

    const toggleFilter = (value, setFn) => {
      setFn(prev =>
        prev.includes(value)
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    };

    return (
      <div className="p-4 md:p-12 max-w-7xl mx-auto pb-24">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-200 flex items-center gap-2">
            <Folder size={20} className="text-emerald-400" /> /projects
          </h2>

          <button
            onClick={() => setShowFilters(v => !v)}
            className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-2"
          >
            <Filter size={14} />
            {showFilters ? "hide_filters" : "show_filters"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-8">
          {/* FILTER PANEL */}
          {showFilters && (
            <div className="space-y-6">
              {/* Tech Filter */}
              <div className="bg-[#0a0a0c] border border-slate-800 rounded-lg p-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 font-mono">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTech.map(t => (
                    <button
                      key={t}
                      onClick={() => toggleFilter(t, setTechFilters)}
                      className={`px-2 py-1 text-[10px] font-mono rounded border transition-all
                      ${techFilters.includes(t)
                          ? "bg-indigo-500/20 border-indigo-400 text-indigo-300"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Filter */}
              <div className="bg-[#0a0a0c] border border-slate-800 rounded-lg p-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 font-mono">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allLanguages.map(l => (
                    <button
                      key={l}
                      onClick={() => toggleFilter(l, setLangFilters)}
                      className={`px-2 py-1 text-[10px] font-mono rounded border transition-all
                      ${langFilters.includes(l)
                          ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(techFilters.length > 0 || langFilters.length > 0) && (
                <button
                  onClick={() => {
                    setTechFilters([]);
                    setLangFilters([]);
                  }}
                  className="text-xs font-mono text-slate-400 hover:text-red-400"
                >
                  clear_all_filters
                </button>
              )}
            </div>
          )}

          {/* PROJECT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map(p => (
              <div
                key={p.id}
                onClick={() =>
                  onOpenFile({
                    id: p.id,
                    title: `${p.title}.tsx`,
                    type: "detail",
                    data: p
                  })
                }
                className="group bg-[#0f0f11] border border-slate-800 hover:border-indigo-500/40 rounded-lg overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-32 bg-slate-900 relative overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-slate-200 font-bold mb-1 group-hover:text-indigo-400 truncate">
                    {p.title}
                  </h3>

                  <p className="text-slate-500 text-xs line-clamp-2 mb-3">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {p.tech?.slice(0, 3).map(t => (
                      <TechTag key={t} label={t} />
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="col-span-full text-center text-slate-500 font-mono text-sm mt-12">
                No projects match selected filters.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }


  if (type === 'detail' && data) {
    return (
      <div className="p-4 md:p-12 max-w-6xl mx-auto pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8 min-w-0">
          <div className="space-y-8 min-w-0">
            <div>
              <div className="flex items-center gap-3 text-xs md:text-sm font-mono text-slate-500 mb-2">
                <span className="flex items-center gap-1"><GitBranch size={12} /> main</span>
                <span className="text-slate-700">|</span>
                <span className="flex items-center gap-1"><Activity size={12} /> {data.deployHistory?.[0]?.version || 'v1.0.0'}</span>
              </div>
              <h1 className="text-2xl md:text-5xl font-bold text-slate-100 mb-2 tracking-tight break-words">{data.title}</h1>
              <p className="text-base md:text-xl text-slate-400 font-light border-l-2 border-emerald-500 pl-4 break-words">{data.subtitle}</p>
            </div>
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4 text-slate-300 font-mono text-sm border-b border-slate-800 pb-2">
                <FileText size={14} className="text-sky-400" /> README.md
              </div>
              <p className="text-slate-300 text-sm leading-relaxed font-mono opacity-90 whitespace-pre-wrap">{data.longDescription}</p>
            </div>
            {data.architecture && (
              <div className="bg-[#0a0a0c] border border-slate-800 rounded-lg p-4 md:p-6 overflow-hidden">
                <div className="flex items-center gap-2 mb-4 text-slate-300 font-mono text-sm">
                  <Server size={14} className="text-orange-400" /> System Architecture
                </div>
                <div className="overflow-x-auto w-full custom-scrollbar">
                  <pre className="font-mono text-xs md:text-sm text-slate-400 leading-relaxed min-w-max">
                    {data.architecture}
                  </pre>
                </div>
              </div>
            )}
            {data.snippet && (
              <div className="bg-[#0f0f11] border border-slate-800 rounded-lg overflow-hidden min-w-0">
                <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <Code size={12} /> core_logic.ts
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/20" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                    <div className="w-2 h-2 rounded-full bg-green-500/20" />
                  </div>
                </div>
                <div className="p-4 overflow-x-auto w-full custom-scrollbar">
                  <pre className="font-mono text-xs md:text-sm text-emerald-300/90 leading-relaxed min-w-max">
                    {data.snippet}
                  </pre>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6 min-w-0">
            <div className="rounded-lg border border-slate-800 shadow-2xl relative group p-4 flex justify-center bg-black/20">
              <img
                src={data.image}
                alt={data.title}
                style={{
                  maxWidth: data.imageStyle?.maxWidth ?? "100%",
                  maxHeight: data.imageStyle?.maxHeight ?? "none",
                  objectFit: data.imageStyle?.objectFit ?? "cover"
                }}
                className="w-auto h-auto"
              />
            </div>


            {/* Languages Bar */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 font-mono flex items-center gap-2">
                Languages
              </h3>
              <div className="flex h-3 rounded-full overflow-hidden mb-3">
                {data.languages.map((lang, index) => (
                  <div
                    key={index}
                    style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
                    className="h-full"
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                    <span className="text-xs text-slate-300 font-mono">
                      {lang.name} <span className="text-slate-500">{lang.percent}%</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unique Deploy Log Section */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 font-mono flex items-center gap-2">
                <HardDrive size={12} /> Deploy Log
              </h3>
              <div className="space-y-3">
                {data.deployHistory ? data.deployHistory.map((deploy, idx) => (
                  <div key={idx} className={`flex gap-2 ${idx !== 0 ? 'opacity-60 hover:opacity-100 transition-opacity' : ''}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${deploy.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <div>
                      <div className="text-xs text-slate-300 font-mono">{deploy.version} - {deploy.msg}</div>
                      <div className="text-[10px] text-slate-500">{deploy.time}</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-xs text-slate-500 italic">No deployment history found.</div>
                )}
              </div>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 font-mono">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">{data.tech.map(t => <TechTag key={t} label={t} />)}</div>
            </div>
            {data.links && (data.links.github || data.links.live) && (
              <div className="flex flex-col gap-3">
                {typeof data.links.github === "string" && data.links.github.trim() !== "" && (
                  <a
                    href={data.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 bg-[#0a0a0c] border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-indigo-400 rounded flex items-center justify-center gap-2 transition-all font-mono text-sm"
                  >
                    <Github size={16} /> git checkout
                  </a>
                )}

                {typeof data.links.live === "string" && data.links.live.trim() !== "" && (
                  <a
                    href={data.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 bg-indigo-600/10 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/20 rounded flex items-center justify-center gap-2 transition-all font-mono text-sm"
                  >
                    <Globe size={16} /> view_deployment
                  </a>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  if (type === 'package') {
    return (
      <div className="p-4 md:p-12 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2 font-mono"><FileJson size={20} className="text-red-400" /> package.json</h2>
        <div className="bg-[#0f0f11] border border-slate-800 rounded-lg p-6 overflow-x-auto custom-scrollbar">
          <pre className="font-mono text-sm text-emerald-300 leading-relaxed">
            {`{
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
  },
  "author": "Arnav",
  "license": "MIT"
}`}
          </pre>
        </div>
      </div>
    );
  }

  if (type === 'readme') {
    const [isPreview, setIsPreview] = useState(true);

    return (
      <div className="p-4 md:p-12 max-w-4xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-slate-200 font-mono font-bold text-xl">
            <FileText size={20} className="text-blue-400" />
            <span>README.md</span>
          </div>

          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setIsPreview(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${isPreview
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              <Eye size={14} /> Preview
            </button>
            <button
              onClick={() => setIsPreview(false)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${!isPreview
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              <Edit3 size={14} /> Source
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isPreview ? (
            <div className="prose prose-invert prose-slate max-w-none font-sans">
              <h1 className="flex items-center gap-3 text-3xl font-bold mb-4">
                <span className="text-4xl">⚙️</span>
                <span>Hi, I’m Arnav</span>
              </h1>

              <p className="lead text-lg text-slate-400 mb-6">
                Developer focused on building performant interfaces, low-level tooling,
                and systems that actually ship.
              </p>

              <hr className="border-slate-800 my-8" />

              <h3 className="text-emerald-400 text-xl font-bold mb-4">
                🧠 What I Work On
              </h3>
              <p className="mb-6 text-slate-300 leading-relaxed">
                I build full-stack applications with React and Node.js, desktop tools in C++
                and Python, and infrastructure-level solutions involving networking,
                automation, and system internals. I enjoy working close to the metal as much
                as I enjoy clean UI/UX.
              </p>

              <h3 className="text-indigo-400 text-xl font-bold mb-4">
                🛠 Core Stack
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none pl-0 mb-8">
                <li className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-slate-800">
                  <span className="text-cyan-400">⚛️</span> React / Vite / Tailwind
                </li>
                <li className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-slate-800">
                  <span className="text-green-500">🟢</span> Node.js / Express
                </li>
                <li className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-slate-800">
                  <span className="text-blue-400">🔷</span> TypeScript / JavaScript
                </li>
                <li className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-slate-800">
                  <span className="text-orange-400">🧠</span> C++ / Win32 / System APIs
                </li>
                <li className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-slate-800">
                  <span className="text-yellow-400">🐍</span> Python / Automation
                </li>
                <li className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-slate-800">
                  <span className="text-sky-400">🌐</span> Networking / Proxies / Tunnels
                </li>
              </ul>

              <h3 className="text-yellow-400 text-xl font-bold mb-4">
                🚀 Projects & Interests
              </h3>
              <p className="text-slate-300 mb-6">
                My work includes desktop input devices (like MouseShifter), browser automation
                tools, full-stack web apps, and experimental networking setups involving VPNs,
                tunneling, and protocol-level debugging.
              </p>

              <h3 className="text-purple-400 text-xl font-bold mb-4">
                📫 Connect
              </h3>
              <p className="text-slate-300">
                Usually shipping side projects, refactoring old ones, or breaking things to
                understand how they work. Reach out if you want to collaborate or build
                something weird and useful.
              </p>
            </div>
          ) : (
            <div className="bg-[#0a0a0c] p-6 rounded-lg border border-slate-800 font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {`# ⚙️ Hi, I’m Arnav

Developer focused on building performant interfaces, low-level tooling,
and systems that actually ship.

---

## 🧠 What I Work On
I build full-stack applications with React and Node.js, desktop tools in C++
and Python, and infrastructure-level solutions involving networking,
automation, and system internals.

## 🛠 Core Stack
- ⚛️ React / Vite / Tailwind
- 🟢 Node.js / Express
- 🔷 TypeScript / JavaScript
- 🧠 C++ / Win32 / System APIs
- 🐍 Python / Automation
- 🌐 Networking / Proxies / Tunnels

## 🚀 Projects & Interests
Desktop input devices, browser automation tools, full-stack web apps,
and experimental VPN / tunneling setups.

## 📫 Connect
Usually shipping side projects or breaking things to understand them.
Open to collaboration on interesting problems.`}
            </div>
          )}
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
  const [toasts, setToasts] = useState([]);

  const dragItem = useRef(null);

  const addToast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const openFile = useCallback((file) => {
    // Check windows
    const existingWindow = windows.find(w => w.id === file.id);
    if (existingWindow) {
      setWindows(prev => prev.map(w => w.id === file.id ? { ...w, zIndex: 100 } : { ...w, zIndex: 40 }));
      return;
    }
    // Check tabs
    const existingTab = tabs.find(t => t.id === file.id);
    if (existingTab) {
      setActiveTabId(file.id);
      return;
    }
    // New tab
    setTabs(prev => [...prev, file]);
    setActiveTabId(file.id);
  }, [tabs, windows]);

  const closeTab = (e, id) => {
    e.stopPropagation();
    if (id === 'home') return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id && newTabs.length > 0) setActiveTabId(newTabs[newTabs.length - 1].id);
  };

  const closeWindow = (e, id) => {
    e.stopPropagation();
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const toggleMaximize = (e, id) => {
    e.stopPropagation();
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        if (w.isMaximized) {
          // Restore
          return {
            ...w,
            isMaximized: false,
            position: w.prevPos || { x: 100, y: 100 },
            size: w.prevSize || { w: 600, h: 400 }
          };
        } else {
          // Maximize
          return {
            ...w,
            isMaximized: true,
            prevPos: w.position,
            prevSize: w.size,
            position: { x: 0, y: 0 },
            size: { w: '100%', h: '100%' } // Taking full available space
          };
        }
      }
      return w;
    }));
  };

  const handleMouseDown = (e, type, id, extra = {}) => {
    e.stopPropagation(); // CRITICAL FIX: Stop bubbling so resize handles don't trigger drag
    if (e.button !== 0) return;

    // Find the window either by id or by checking for window-related actions
    const activeWindow = windows.find(w => w.id === id);

    if (type === 'focus') {
      // Just bring to front, no drag
      setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: 100 } : { ...w, zIndex: 40 }));
      return;
    }

    if (type === 'window') {
      // Bring to front
      setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: 100 } : { ...w, zIndex: 40 }));
      // Logic for drag start is handled, but if maximized, we wait for move to restore
    }

    dragItem.current = {
      type: extra.action || type,
      id,
      startX: e.clientX,
      startY: e.clientY,
      initialPos: activeWindow ? activeWindow.position : null,
      initialSize: activeWindow ? activeWindow.size : null,
      hasDetached: false,
      dir: extra.dir // For resizing direction
    };
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !dragItem.current) return;
    const { type, id, startX, startY, initialPos, initialSize, hasDetached, dir } = dragItem.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (type === 'tab') {
      if (id === 'home') return;
      if (!hasDetached && dy > 30) {
        const tabToDetach = tabs.find(t => t.id === id);
        if (tabToDetach) {
          const newTabs = tabs.filter(t => t.id !== id);
          setTabs(newTabs);
          if (activeTabId === id && newTabs.length > 0) setActiveTabId(newTabs[newTabs.length - 1].id);
          const newWindow = { ...tabToDetach, position: { x: e.clientX - 200, y: e.clientY - 20 }, size: { w: 600, h: 400 }, zIndex: 100, isMaximized: false };
          setWindows(prev => [...prev, newWindow]);
          dragItem.current = { type: 'window', id: id, startX: e.clientX, startY: e.clientY, initialPos: { x: e.clientX - 200, y: e.clientY - 20 }, initialSize: { w: 600, h: 400 }, hasDetached: true };
        }
      }
    }
    if (type === 'window') {
      const activeWindow = windows.find(w => w.id === id);

      // DRAG TO RESTORE LOGIC
      if (activeWindow && activeWindow.isMaximized) {
        // Only trigger if moved significantly (drag threshold)
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          const restoredW = activeWindow.prevSize?.w || 600;
          // Center the window on the mouse cursor horizontally
          const newX = e.clientX - (restoredW / 2);
          const newY = e.clientY;

          // Adjust the drag offset so it doesn't jump
          dragItem.current.initialPos = { x: newX, y: newY };
          // Reset start coords to current to avoid double jump
          dragItem.current.startX = e.clientX;
          dragItem.current.startY = e.clientY;

          setWindows(prev => prev.map(w => w.id === id ? {
            ...w,
            isMaximized: false,
            size: w.prevSize || { w: 600, h: 400 },
            position: { x: newX, y: newY }
          } : w));
        }
        return;
      }

      const newX = initialPos.x + dx;
      const newY = initialPos.y + dy;
      setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x: newX, y: newY } } : w));
      if (e.clientY < 60) setDockHighlight(true); else setDockHighlight(false);
    }
    if (type === 'resize') {
      // Directions: 'nw', 'ne', 'sw', 'se'
      let newX = initialPos.x;
      let newY = initialPos.y;
      let newW = initialSize.w;
      let newH = initialSize.h;

      // Handle Horizontal (Width & X)
      if (dir.includes('e')) {
        // Dragging right edge: width increases
        newW = Math.max(300, initialSize.w + dx);
      } else if (dir.includes('w')) {
        // Dragging left edge: x changes, width changes inversely
        const possibleW = initialSize.w - dx;
        if (possibleW > 300) {
          newX = initialPos.x + dx;
          newW = possibleW;
        }
      }

      // Handle Vertical (Height & Y)
      if (dir.includes('s')) {
        // Dragging bottom edge: height increases
        newH = Math.max(200, initialSize.h + dy);
      } else if (dir.includes('n')) {
        // Dragging top edge: y changes, height changes inversely
        const possibleH = initialSize.h - dy;
        if (possibleH > 200) {
          newY = initialPos.y + dy;
          newH = possibleH;
        }
      }

      setWindows(prev => prev.map(w => w.id === id ? {
        ...w,
        position: { x: newX, y: newY },
        size: { w: newW, h: newH }
      } : w));
    }
  }, [isDragging, tabs, activeTabId, windows]);

  const handleMouseUp = useCallback((e) => {
    if (!isDragging || !dragItem.current) return;
    const { type, id } = dragItem.current;
    if (type === 'window' && e.clientY < 60) {
      const win = windows.find(w => w.id === id);
      if (win) {
        setWindows(prev => prev.filter(w => w.id !== id));
        setTabs(prev => [...prev, win]);
        setActiveTabId(id);
      }
    }
    setIsDragging(false);
    setDockHighlight(false);
    dragItem.current = null;
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
    <div className="h-screen w-full bg-[#0a0a0c] text-slate-300 font-sans overflow-hidden flex selection:bg-indigo-500/30 selection:text-white relative">
      <CodeRainBackground />
      <CustomScrollbarStyles />
      <ToastContainer toasts={toasts} />

      {/* SIDEBAR */}
      <Sidebar onOpenFile={openFile} onToast={addToast} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden min-w-0">
        <div className={`h-10 bg-[#0a0a0c] border-b border-slate-800/50 flex items-end px-2 gap-1 overflow-x-auto relative transition-colors duration-300 shrink-0 custom-scrollbar ${dockHighlight ? 'bg-indigo-900/20 border-indigo-500/50' : ''}`}>
          {dockHighlight && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-indigo-500/10 text-indigo-300 font-mono text-xs z-50">
              <ArrowLeft size={14} className="rotate-90 mr-2" /> Release to Dock
            </div>
          )}
          {tabs.map(tab => (
            <div
              key={tab.id}
              onMouseDown={(e) => handleMouseDown(e, 'tab', tab.id)}
              onClick={() => setActiveTabId(tab.id)}
              className={`
                 group relative px-4 py-2 text-xs font-mono border-t border-l border-r rounded-t-lg flex items-center gap-2 cursor-pointer select-none min-w-[120px] max-w-[200px] shrink-0
                 ${activeTabId === tab.id ? 'bg-[#0f0f11] border-slate-700 text-slate-200 z-10' : 'border-transparent text-slate-500 hover:bg-slate-800/30'}
               `}
            >
              {tab.type === 'home' ? <FileCode size={12} className="text-indigo-400" /> :
                tab.type === 'package' ? <FileJson size={12} className="text-red-400" /> :
                  tab.type === 'readme' ? <FileText size={12} className="text-blue-400" /> :
                    <FileText size={12} className={tab.type === 'projects' ? 'text-emerald-400' : 'text-amber-400'} />}
              <span className="truncate flex-1">{tab.title}</span>
              {tab.id !== 'home' && (
                <X size={12} className="opacity-0 group-hover:opacity-100 hover:text-red-400" onClick={(e) => closeTab(e, tab.id)} />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 bg-[#0f0f11] relative overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent custom-scrollbar">
          {tabs.map(tab => (
            <div key={tab.id} className={`h-full w-full ${activeTabId === tab.id ? 'block' : 'hidden'}`}>
              <ContentRenderer
                type={tab.type}
                data={tab.data}
                content={tab.content}
                lang={tab.lang}
                onOpenFile={openFile}
              />
            </div>
          ))}
          {tabs.length === 0 && <div className="h-full flex items-center justify-center text-slate-600 font-mono text-sm">No active files.</div>}
        </div>

        {/* FOOTER */}
        <div className="h-6 bg-[#007acc] md:bg-[#0a0a0c] border-t border-slate-800 flex justify-between items-center px-3 text-[10px] md:text-xs font-mono text-slate-400 z-30 relative shrink-0">
          <div className="flex gap-4">
            <button
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
              className="flex items-center gap-1 hover:text-white cursor-pointer hover:bg-slate-800 px-2 rounded transition-colors"
            >
              <Terminal size={10} />
              <span>TERMINAL</span>
            </button>
            <div className="flex items-center gap-1"><GitBranch size={10} /> <span>main*</span></div>
          </div>
          <div className="flex gap-4">
            <span>Ln 12, Col 45</span>
            <span className="text-emerald-500">Node v20.1</span>
          </div>
        </div>
      </div>

      {/* WINDOWS */}
      {windows.map(win => (
        <div
          key={win.id}
          style={{ position: 'absolute', left: win.position.x, top: win.position.y, width: win.size.w, height: win.size.h, zIndex: win.zIndex || 40 }}
          // Changed: Now only handles focus/z-index, NOT drag.
          onMouseDown={(e) => handleMouseDown(e, 'focus', win.id)}
          className="bg-[#0a0a0c] border border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/50"
        >
          {/* Changed: Drag handler moved specifically to the title bar div */}
          <div
            className="h-8 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-2 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={(e) => handleMouseDown(e, 'window', win.id)}
            onDoubleClick={(e) => toggleMaximize(e, win.id)}
          >
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <GripHorizontal size={12} />
              <span>{win.title}</span>
            </div>
            {/* Prevent drag when clicking window controls */}
            <div className="flex items-center gap-1.5" onMouseDown={(e) => e.stopPropagation()}>
              <div
                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 rounded cursor-pointer transition-colors"
                onClick={(e) => toggleMaximize(e, win.id)}
                title={win.isMaximized ? "Restore" : "Maximize"}
              >
                {win.isMaximized ? <Minimize2 size={13} /> : <Square size={13} />}
              </div>
              <div
                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/80 rounded cursor-pointer transition-colors"
                onClick={(e) => closeWindow(e, win.id)}
                title="Close"
              >
                <X size={14} />
              </div>
            </div>
          </div>
          <div className="flex-1 bg-[#0f0f11] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-700 custom-scrollbar">
            <ContentRenderer
              type={win.type}
              data={win.data}
              content={win.content}
              lang={win.lang}
              onOpenFile={openFile}
            />
          </div>

          {/* Resize Handles - All Corners - CONDITIONAL: Hide if maximized */}
          {!win.isMaximized && (
            <>
              {/* NW - Top Left */}
              <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'nw' })} />
              {/* NE - Top Right */}
              <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'ne' })} />
              {/* SW - Bottom Left */}
              <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'sw' })} />
              {/* SE - Bottom Right (Visual indicator REMOVED, now invisible like others) */}
              <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'se' })} />
            </>
          )}
        </div>
      ))}

      {/* INTEGRATED TERMINAL */}
      <IntegratedTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onOpenFile={openFile}
      />

    </div>
  );
};

export default App;
