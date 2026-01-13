# VSCode Portfolio Template

A developer portfolio that looks, feels, and behaves like a modern code editor.

![VSCode Portfolio Preview](https://raw.githubusercontent.com/arnofrxdd/portfolio/main/portfolio.png)

This template is designed to mimic the workflow and interaction patterns of Visual Studio Code. It features a custom window management system, an AI-powered terminal, and a high-performance Canvas-based contribution grid.

---

## Key Features

### Canvas Contribution Map

* High Performance: Powered by a custom HTML5 Canvas engine for smooth animations
* Theme Aware: Automatically adapts colors, glow effects, and block shapes (circles, squares, or rounded) based on the active VS Code theme
* Interactive: Real-time contribution count calculation and dynamic word cycling

### Window Management System

* Tab Detachment: Drag any tab out of the editor bar to spawn a standalone, draggable window
* Advanced Resizing: Resize windows from any edge or corner with Windows-style clamping and viewport boundaries
* State Persistence: Windows maintain scroll positions and z-index focus during multitasking

### AI-Integrated Terminal

* Gemini API: Natural-language interaction powered by Google Gemini 2.5 Flash
* CLI Simulation: Functional shell supporting `ls`, `cat`, `open`, and `clear` commands

---

## Tech Stack

* Core: React 18, Vite
* Rendering: HTML5 Canvas API
* Styling: Tailwind CSS
* Icons: Lucide React
* AI: Google Gemini API

---

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/arnofrxdd/ide-portfolio.git
cd ide-portfolio
npm install
```

---

### 2. Configure Environment

Generate a free Gemini API key from Google AI Studio and create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

---

### 3. Run Development Server

```bash
npm run dev
```

---

## Terminal Commands

| Command       | Description                           |
| ------------- | ------------------------------------- |
| `help`        | Show available commands               |
| `ls`          | List all projects found in the system |
| `cat <name>`  | Print a summary of a project          |
| `open <name>` | Open a project file or window         |
| `clear`       | Clear the terminal history            |
| `whoami`      | Display user information              |
| Any query     | Chat directly with the integrated AI  |

---

## License

MIT License. You are free to use, modify, and distribute this template.
