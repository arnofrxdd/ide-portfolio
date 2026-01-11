# VSCode Portfolio Template

![VSCode Portfolio Preview](https://raw.githubusercontent.com/arnofrxdd/ide-portfolio/assests/Screenshot%202026-01-12%20045030.png)

A developer portfolio that looks, feels, and behaves like your favorite IDE.

Built with **React**, **Tailwind CSS**, and **Vite**, this template features a fully interactive file system, an AI-powered terminal, and a powerful window management system.

---

## Key Features

### Draggable & Resizable Windows

This is **not** a static UI.

* Drag tabs out of the dock to create floating windows
* Resize from all corners
* Maximize / restore like a real OS window
* True multitasking experience

### AI‑Integrated Terminal

A functional CLI connected to **Google Gemini API**.

* Ask questions about projects or skills
* Natural language queries
* Built‑in commands (`ls`, `cat`, `open`, etc.)

### Interactive File Explorer

* Folder tree navigation
* Open `.md`, `.json`, `.tsx` files
* Project search & filtering

### Authentic VSCode Theme

* Pixel‑accurate VSCode‑inspired UI
* Built entirely with Tailwind CSS
* Smooth animations & transitions

---

## Getting Started

### Clone & Install

```bash
git clone https://github.com/yourusername/vscode-portfolio.git
cd vscode-portfolio
npm install
```

---

### Configure Environment (Gemini AI)

To enable AI terminal features, get a **free Gemini API key** from:

[https://aistudio.google.com](https://aistudio.google.com)

Create a `.env` file in the root directory:

```bash
touch .env
```

Add your API key:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

---

### Run Development Server

```bash
npm run dev
```

---

## Customization Tutorial

### Adding Your Projects

File:

```bash
src/data/projects.js
```

This file drives:

* File Explorer
* Search
* Terminal commands

Example:

```js
export const PROJECTS_DATA = [
  {
    id: "my-cool-app",
    title: "My Cool App",
    type: "Web App",
    tech: ["React", "Node.js", "MongoDB"],
    date: "2024",
    description: "Short description for cards",
    longDescription: "Detailed markdown shown in file view",
  }
]
```

---

### Editing Personal Info (Home Screen)

File:

```bash
src/App.jsx
```

Search for:

```js
type === 'home'
```

Edit:

* `WORDS` array (typing animation)
* JSX content for intro text

---

### Modifying README.md Content

Search for:

```js
type === 'readme'
```

Edit:

* Markdown preview content
* Bio, skills, and contact info

---

### Extending the Terminal

Component:

```bash
IntegratedTerminal.jsx
```

Add new commands inside `handleCommand`:

```js
if (command === 'mycommand') {
  // custom logic
}
```

---

## Terminal Commands

| Command          | Description             |
| ---------------- | ----------------------- |
| `help`           | Show available commands |
| `ls` / `list`    | List all projects       |
| `cat <project>`  | Print project summary   |
| `open <project>` | Open project window     |
| `clear`          | Clear terminal          |
| `whoami`         | Show user info          |
| *(any text)*     | Chat with Gemini AI     |

---

## Tech Stack

* **Framework:** React 18
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **AI:** Google Gemini API

---

## License

MIT License.

Use it, fork it, remix it, ship it
