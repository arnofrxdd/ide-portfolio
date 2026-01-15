import {
  Lock, GitBranch, FileText, Server, FileJson, Atom, FileCode2, Info
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
# Arnav's Portfolio IDE 🚀

<p align="center">
  <img src="https://img.shields.io/badge/Version-2.0.0--stable-blue?style=for-the-badge&logo=visual-studio-code" alt="Version" />
  <img src="https://img.shields.io/badge/Environment-Production--Ready-success?style=for-the-badge&logo=github" alt="Environment" />
  <img src="https://img.shields.io/badge/Built%20With-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react" alt="Built With" />
</p>

## 🖥 Overview

**Arnav's Portfolio** is not just a website; it's a high-performance, browser-based **Visual Studio Code environment** designed to showcase technical expertise through an immersive developer experience. 

Built with **React 18**, **TypeScript**, and motivated by authentic IDE principles, it features a fully functional file explorer, terminal, settings engine, and even an integrated AI architect.

---

## ✨ Key Features

### 📂 Virtualized File System
*   **Source Explorer:** Navigate through a structured codebase featuring real projects and configuration files.
*   **Context Menus:** Right-click support for folder expansion and file actions.
*   **Tab Management:** Multi-tab interface with persistence and drag-to-reorder functionality.

### ⌨️ Integrated Intelligent Terminal
*   **Shell Runtime:** Execute commands like \\"ls\\", \\"cat\\", and \\"open\\" to interact with the portfolio data.
*   **AI Integration:** Powered by Google Gemini (Flash 1.5), allowing natural language queries directly in the terminal buffer.
*   **Authentic UI:** Pixel-perfect terminal styling with standard tab-switching and history persistence.

### ⚙️ Customizable Workbench
*   **Theme Engine:** Seamlessly switch between **Dark Modern**, **Dracula**, **Monokai**, and **GitHub Dark**.
*   **Settings Dashboard:** Fully searchable settings panel to toggle Word Wrap, Minimap, and Layout styles.
*   **Layout Modes:** Choose between a **Cinematic Stylish** view and an **Authentic VS Code** environment.

### 🧠 System Intelligence
*   **Secondary Sidebar:** Real-time analysis of the active file or project, displaying a **Technical Summary** and **Build Composition**.
*   **Manifest Audit:** Low-level metadata extraction including deployment history and repository status.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18.x or higher)
*   NPM or PNPM

### Installation
\`\`\`bash
# Clone the repository
git clone https://github.com/arnofrxdd/ide-portfolio.git

# Navigate to directory
cd ide-portfolio

# Install dependencies
npm install
\`\`\`

### Environment Configuration
Create a .env file in the root directory to enable AI features:
\`\`\`env
VITE_GEMINI_API_KEY=your_google_ai_key_here
\`\`\`

### Launch Development Server
\`\`\`bash
npm run dev
\`\`\`

---

## ⌨️ Command Palette & Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| Ctrl/Cmd + P | Open Command Palette (Quick Open) |
| Ctrl/Cmd + \\\\ | Toggle Secondary Sidebar |
| Ctrl/Cmd + J | Toggle Integrated Terminal |
| Alt + Z | Toggle Word Wrap |

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 18 (Vite Runtime) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Vanilla CSS + Tailwind v4 |
| **Icons** | Lucide React |
| **Animation** | Framer Motion |
| **Intelligence** | Google Gemini 1.5 Flash |

---

## 📄 License
This project is licensed under the MIT License.

<p align="center">
  Built with ❤️ for the Developer Community
</p>
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
    ".env": { icon: Lock, color: "text-amber-400" },
    ".gitignore": { icon: GitBranch, color: "text-orange-600" },
    "package.json": { icon: FileJson, color: "text-yellow-400" },
    "readme.md": { icon: Info, color: "text-blue-400" },
    "license": { icon: FileText, color: "text-yellow-600" },
    "dockerfile": { icon: Server, color: "text-blue-500" },
  },
  extensions: {
    tsx: { icon: Atom, color: "text-cyan-400" }, // React Blue
    ts: { icon: FileCode2, color: "text-blue-500" }, // TS Blue
    jsx: { icon: Atom, color: "text-yellow-400" },
    js: { icon: FileCode2, color: "text-yellow-400" },
    json: { icon: FileJson, color: "text-yellow-400" },
    html: { icon: FileCode2, color: "text-orange-500" },
    css: { icon: FileCode2, color: "text-blue-400" },
    md: { icon: FileText, color: "text-slate-400" },
    txt: { icon: FileText, color: "text-slate-400" },
    env: { icon: Lock, color: "text-amber-400" },
    py: { icon: FileCode2, color: "text-green-500" },
    go: { icon: FileCode2, color: "text-sky-400" },
    cpp: { icon: FileCode2, color: "text-blue-600" },
    c: { icon: FileCode2, color: "text-slate-400" },
    pdf: { icon: FileText, color: "text-red-400" },
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
