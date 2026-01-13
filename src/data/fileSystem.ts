import {
  Lock, GitBranch, Box, FileText, Server, FileCode, FileJson
} from 'lucide-react';
import { PROJECTS_DATA } from './projects';

/* --- FILE CONTENT CONSTANTS --- */
export const FILE_CONTENTS = {
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
  readme: `
# ide-portfolio

![Status](https://img.shields.io/badge/status-stable-success) ![License](https://img.shields.io/badge/license-MIT-blue) ![React](https://img.shields.io/badge/react-18-cyan) ![TypeScript](https://img.shields.io/badge/typescript-5-blue)

A developer portfolio reimagined as a fully functional IDE. This project is built to look, feel, and behave like Visual Studio Code, providing an immersive experience for visitors to explore your work.

![ide-portfolio Preview](https://raw.githubusercontent.com/arnofrxdd/portfolio/main/portfolio.png)

## ✨ Features

*   **Virtual File System**: Browse projects and files just like in a real editor.
*   **Integrated Terminal**: A functional shell with commands (\`ls\`, \`cat\`, \`open\`) and **Gemini AI integration** for natural language queries.
*   **Command Palette**: Quick navigation and actions via \`Ctrl/Cmd + P\`.
*   **Theme System**: Switch between modern dark themes (Dracula, Monokai, GitHub Dark, etc.).
*   **Window Management**: Draggable, resizable windows (tabs can be detached!).
*   **Contribution Map**: A beautiful, canvas-based commit graph visualization.
*   **Type-Safe**: Built with 100% TypeScript for robustness.

## 🛠️ Tech Stack

*   **Core**: React 18, Vite
*   **Styling**: Tailwind CSS (v4)
*   **Icons**: Lucide React
*   **AI**: Google Gemini API (Flash 1.5)
*   **Effects**: Framer Motion, HTML5 Canvas

## 🚀 Getting Started

### 1. Clone & Install
\`\`\`bash
git clone https://github.com/arnofrxdd/ide-portfolio.git
cd ide-portfolio
npm install
\`\`\`

### 2. Configure Environment
Create a \`.env\` file in the root directory:
\`\`\`env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`
> Get your key from [Google AI Studio](https://aistudio.google.com/).

### 3. Run Locally
\`\`\`bash
npm run dev
\`\`\`

## ⌨️ Terminal Commands

| Command | Description |
| :--- | :--- |
| \`help\` | Show available commands |
| \`ls\` | List all projects |
| \`cat <project>\` | View project details |
| \`open <project>\` | Open full project view |
| \`clear\` | Clear terminal |
| \`[query]\` | Ask AI anything! |

## 🎨 Customization

See [CONTRIBUTING.md](./CONTRIBUTING.md) for a detailed guide on:
*   Adding new projects
*   Adding custom files
*   Creating new commands
*   Modifying themes

## 📄 License

MIT © [Arnav]
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
export const FILE_SYSTEM_CONFIG = {
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

export const getFileIcon = (filename: string) => {
  if (!filename) return FILE_SYSTEM_CONFIG.default;
  const lowerName = filename.toLowerCase();
  // @ts-ignore
  if (FILE_SYSTEM_CONFIG.filenames[lowerName]) return FILE_SYSTEM_CONFIG.filenames[lowerName];
  const ext = lowerName.split('.').pop();
  // @ts-ignore
  if (ext && FILE_SYSTEM_CONFIG.extensions[ext]) return FILE_SYSTEM_CONFIG.extensions[ext];
  return FILE_SYSTEM_CONFIG.default;
};
