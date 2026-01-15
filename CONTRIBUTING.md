# Developer Guide: Hacking the ide-portfolio

Welcome to the internal documentation for "ide-portfolio". This project is designed to be treated like a real operating system or IDE. This guide will help you hack, extend, and customize every part of it.use this codebase as a template for their own "VSCODE-like" websites.

---

## 📚 Table of Contents
1.  [Philosophy & Architecture](#1-philosophy--architecture)
2.  [The Virtual File System](#2-the-virtual-file-system)
3.  [Common Workflows](#3-common-workflows)
    *   [Adding a Project (The "Database")](#31-adding-a-project)
    *   [Adding Static Files](#32-adding-static-files)
    *   [Adding New Pages/Views](#33-adding-new-system-pages)
4.  [Customizing the "Editor"](#4-customizing-the-os)
    *   [Theming Engine](#41-theming-engine)
    *   [Command Palette Logic](#42-command-palette-registry)
    *   [Terminal & AI Personas](#43-terminal--ai)
5.  [Component Deep Dive](#5-component-deep-dive)
6.  [Troubleshooting](#6-troubleshooting)

---

## 1. Philosophy & Architecture

This application is a **Single Page Application (SPA)** that *mimics* an Operating System window manager and IDE.

### Core Concepts
*   **Global State**: `App.tsx` holds the "OS State" — open windows, active tabs, theme, and window Z-indices.
*   **Content Rendering**: The `ContentRenderer` component acts as the "Window Content". It takes a `type` prop (e.g., 'code', 'project', 'home') and decides what React component to render.
*   **Data-Driven UI**: The Sidebar tree, Project Cards, and Command Palette results are all generated from static JSON-like data structures in `src/data/`.

```
src/
├── data/               # The "Database"
│   ├── projects.ts     # Metadata for all your projects
│   ├── fileSystem.ts   # Raw text content for virtual files (.env, notes)
│   └── themes.ts       # CSS variable definitions for themes
├── components/
│   ├── Sidebar/        # The File Explorer logic
│   ├── Editor/         # The "Screen" (renders Code/Home/Pages)
│   ├── Terminal/       # The CLI & AI Logic
│   └── Widgets/        # UI elements (Calendar, Git Graph)
```

---

## 2. The Virtual File System

The "File System" is an abstraction split into two parts:

1.  **Metadata (`projects.ts`)**: Represents "Rich Content". These are your portfolio projects. They have images, tags, descriptions, and links.
2.  **Raw Content (`fileSystem.ts`)**: Represents "Text Files". These are things like `.env`, `readme.md`, or code snippets you want to show code highlighting for.

---

## 3. Common Workflows

### 3.1 Adding a Project
Projects are the most important entity. They appear in:
*   Sidebar (`src/projects/`)
*   Terminal (`ls` command)
*   Projects Page (Gallery view)
*   Search (`Cmd+P`)

**Step 1:** Create a file `src/data/projects/myProject.ts`.
```typescript
export const myProject = {
    id: "my-project-slug",      // Unique ID used in URL/Routing
    title: "My Super App",      // Display Title
    subtitle: "It solves everything",
    description: "A short summary for the gallery card.",
    longDescription: `
# Detailed View
You can write **Markdown** here!
- Feature A
- Feature B
    `,
    tech: ["React", "TypeScript"], // Tags
    featured: true,             // Show on Home Page?
    links: {
        github: "https://github.com/...",
        live: "https://demo.com"
    }
};
```

**Step 2:** Register it in `src/data/projects.ts`.
```typescript
import { myProject } from "./projects/myProject";

export const PROJECTS_DATA = [
    // ... other projects
    myProject
];
```

*Automagic*: The system will now auto-generate the file tree entry, the project card, and the details view.

### 3.2 Adding Static Files
To add a file like `resume.json` or `config.yaml` to the sidebar:

**Step 1:** Add Content to `src/data/fileSystem.ts`.
```typescript
export const FILE_CONTENTS = {
    // ...
    my_resume: `
    {
      "name": "Arnav",
      "hired": true
    }
    `
};
```

**Step 2:** Add Visual Entry to `src/components/Sidebar/Sidebar.tsx`.
Find the render loop (e.g., inside the "Explorer" mapped section) and add:
```tsx
<FileTreeItem
    name="resume.json"
    icon={FileJson} // Lucide Icon
    onClick={() => onOpenFile({
        id: "my_resume",        // ID from FILE_CONTENTS
        title: "resume.json",   // Tab Title
        type: "code",           // Opens Code Editor
        content: FILE_CONTENTS.my_resume,
        lang: "json"            // Syntax Highlight Language
    })}
/>
```

### 3.3 Adding New System Pages
Want a "Contact Me" page that isn't a code file?

1.  Create `src/pages/Contact.tsx`.
2.  Open `src/components/Editor/ContentRenderer.tsx`.
3.  Add a case:
    ```tsx
    if (type === 'contact') return <ContactPage />;
    ```
4.  Trigger it from Sidebar or Command Palette using `onOpenFile({ type: 'contact', title: 'Contact' })`.

---

## 4. Customizing the Editor

### 4.1 Theming Engine
We use CSS Variables for instant theme switching.
**File**: `src/data/themes.ts`.

To create a **"Cyberpunk"** theme:
```typescript
cyberpunk: {
    name: "Cyberpunk 2077",
    colors: {
        '--bg-main': '#000b1e',
        '--bg-panel': '#02122b',
        '--accent': '#fcee0a', // Cyber Yellow
        '--text-primary': '#05d9e8', // Neon Blue
        // ... map all other required keys
    }
}
```

### 4.2 Command Palette Registry
**File**: `src/components/CommandPalette/CommandPalette.tsx`.

The `allItems` array defines what shows up in `Cmd+P`.
*   **Navigation Items**: `{ type: 'file', path: '...' }`
*   **Action Items**: `{ type: 'command', action: 'do_something' }`

To add a generic action:
```typescript
// 1. Add to allItems
items.push({ 
    id: 'reload', 
    title: '> Reload Window', 
    type: 'command', 
    action: 'reload_window' 
});

// 2. Handle in 'handleKeyDown'
if (item.action === 'reload_window') {
    window.location.reload();
}
```

### 4.3 Terminal & AI
**File**: `src/components/Terminal/Terminal.tsx`.

The `handleCommand` function parses input strings.
*   **Simple commands**: `if (cmd === 'ping') return 'pong';`
*   **AI**: If no command matches, it calls `generateGeminiResponse()` in `src/services/gemini.ts`. You can edit the `SYSTEM_PROMPT` there to change the AI's personality (e.g., "You are a helpful assistant" vs "You are a terminal from 1985").

---

## 5. Component Deep Dive

*   **`App.tsx`**:
    *   Manages the `tabs` array (what's open).
    *   Manages `activeTabId` (what's focused).
    *   Handles "Windowing" (popping tabs out into draggable `DraggableWindow` components).
    
*   **`Sidebar.tsx`**:
    *   Uses `activeView` state ('explorer', 'search', 'git') to toggle panels.
    *   The "Explorer" view is a mix of hardcoded system folders (`src`, `components`) and dynamic `PROJECTS_DATA` mapping.

*   **`ContentRenderer.tsx`**:
    *   The "Router" of the application.
    *   It does *not* use React Router. It conditionally renders based on the `activeTab.type`.

---

## 6. Troubleshooting

*   **Icons Missing?**
    *   Make sure you import them from `lucide-react` in the file where you use them.
    *   If mapping dynamically, ensure your dictionary in `fileSystem.ts` -> `getFileIcon` covers the file extension.

*   **Blank Screen?**
    *   Check the console. Using `lucide-react` icons as values instead of types was a previous bug.
    *   Ensure all `PROJECTS_DATA` entries have unique IDs.

*   **Tailwind Not Working?**
    *   We use a scoped CSS variable approach. Ensure your component uses `bg-[var(--bg-main)]` instead of hardcoded hex values to support theming.
