import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, ArrowLeft, Terminal, GitBranch,
  AlertCircle, CheckCircle, Bell, GripHorizontal, Minimize2, Square, PanelRight, Code, Minus
} from 'lucide-react';

// Data
import { THEMES } from './data/themes';
import { getFileIcon } from './data/fileSystem';

// Context
import { ThemeContext } from './context/ThemeContext';

// Components
import { CodeRainBackground } from './components/Effects/CodeRain';
import { CustomScrollbarStyles } from './components/Styles/CustomScrollbar';
import { ToastContainer } from './components/UI/Toast';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ContentRenderer } from './components/Editor/ContentRenderer';
import { IntegratedTerminal } from './components/Terminal/Terminal';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { ContextMenu } from './components/UI/ContextMenu';
import { SecondarySidebar } from './components/Sidebar/SecondarySidebar';

const App = () => {
  const [tabs, setTabs] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_tabs');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If the user closed everything and reloads, force home to reopen for better UX
        return parsed.length > 0 ? parsed : [{ id: 'home', title: 'home.tsx', type: 'home', data: null }];
      }
      return [{ id: 'home', title: 'home.tsx', type: 'home', data: null }];
    } catch (e) {
      return [{ id: 'home', title: 'home.tsx', type: 'home', data: null }];
    }
  });
  const [activeTabId, setActiveTabId] = useState(() => {
    // Check if tabs would be force-restored to home
    const savedTabsStr = localStorage.getItem('portfolio_tabs');
    let savedTabs: any[] = [];
    try {
      savedTabs = savedTabsStr ? JSON.parse(savedTabsStr) : [];
    } catch (e) { savedTabs = []; }

    // If tabs are empty, we know the app forces 'home', so active tab must be 'home'
    if (!savedTabs.length) return 'home';

    const savedActive = localStorage.getItem('portfolio_active_tab');
    // Verify saved active tab still exists in saved tabs
    if (savedActive && savedTabs.some(t => t.id === savedActive)) return savedActive;

    // Fallback to first available tab
    return savedTabs[0]?.id || 'home';
  });
  const [windows, setWindows] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_windows');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dockHighlight, setDockHighlight] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSecondarySidebarOpen, setIsSecondarySidebarOpen] = useState(() => {
    // On small screens, always start with sidebar closed to save space
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return false;

    const saved = localStorage.getItem('portfolio_secondary_sidebar_open');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    // Only persist secondary sidebar state on larger screens
    if (window.innerWidth >= 1024) {
      localStorage.setItem('portfolio_secondary_sidebar_open', JSON.stringify(isSecondarySidebarOpen));
    }
  }, [isSecondarySidebarOpen]);

  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('portfolio_theme');
    // @ts-ignore
    return saved && THEMES[saved] ? saved : 'darkModern';
  });

  const [installedThemes, setInstalledThemes] = useState<string[]>(() => {
    const savedInstalled = localStorage.getItem('portfolio_installed_themes');
    const activeTheme = localStorage.getItem('portfolio_theme') || 'darkModern';

    let list = savedInstalled
      ? JSON.parse(savedInstalled)
      : ['darkModern', 'vscode', 'githubDark', 'nord', 'oneDarkPro', 'dracula'];

    // Migration/Safety: If their active theme isn't in the installed list, add it automatically
    // This prevents "Not Installed" state for currently active themes on first load after the update
    // @ts-ignore
    if (activeTheme && THEMES[activeTheme] && !list.includes(activeTheme)) {
      list.push(activeTheme);
    }

    return list;
  });

  useEffect(() => {
    localStorage.setItem('portfolio_installed_themes', JSON.stringify(installedThemes));
  }, [installedThemes]);



  const [homepageLayout, setHomepageLayout] = useState<'modern' | 'vscode'>(() => {
    const saved = localStorage.getItem('portfolio_homepage_layout');
    return (saved === 'modern' || saved === 'vscode') ? saved as any : 'modern';
  });

  useEffect(() => {
    localStorage.setItem('portfolio_homepage_layout', homepageLayout);
  }, [homepageLayout]);

  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, type: string, id: string } | null>(null);
  const [toasts, setToasts] = useState<any[]>([]);

  const [editorSettings, setEditorSettings] = useState(() => {
    const saved = localStorage.getItem('portfolio_editor_settings');
    return saved ? JSON.parse(saved) : { minimap: true, wordWrap: false };
  });

  useEffect(() => {
    localStorage.setItem('portfolio_editor_settings', JSON.stringify(editorSettings));
  }, [editorSettings]);

  useEffect(() => {
    localStorage.setItem('portfolio_tabs', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem('portfolio_active_tab', activeTabId);
  }, [activeTabId]);

  useEffect(() => {
    localStorage.setItem('portfolio_windows', JSON.stringify(windows));
  }, [windows]);

  const tabBarRef = useRef<HTMLDivElement>(null);
  const draggingTabId = useRef<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const dragItem = useRef<any>(null);
  const scrollPositions = useRef<Record<string, number>>({});
  const editorScrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setIsTerminalOpen(true);
    window.addEventListener('open-terminal', handler);
    return () => window.removeEventListener('open-terminal', handler);
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      const themeKey = e.detail;
      // @ts-ignore
      if (THEMES[themeKey]) {
        setCurrentTheme(themeKey);
      }
    };
    window.addEventListener('set-theme', handler);
    return () => window.removeEventListener('set-theme', handler);
  }, []);

  const settingsRef = useRef(editorSettings);
  useEffect(() => {
    settingsRef.current = editorSettings;
  }, [editorSettings]);

  useEffect(() => {
    const handler = (e: any) => {
      const key = e.detail;
      const currentVal = settingsRef.current[key];
      const newVal = !currentVal;
      addToast(`Toggled ${key === 'wordWrap' ? 'Word Wrap' : 'Minimap'} ${newVal ? 'On' : 'Off'} `, 'info');
      setEditorSettings((prev: any) => ({
        ...prev,
        [key]: newVal
      }));
    };
    window.addEventListener('toggle-setting', handler);
    return () => window.removeEventListener('toggle-setting', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem('portfolio_theme', currentTheme);
    // @ts-ignore
    const themeColors = THEMES[currentTheme].colors;
    const root = document.documentElement;

    // Set defaults for variables that might not be in every theme
    root.style.setProperty('--accent-fg', '#ffffff');

    // @ts-ignore
    for (const [key, value] of Object.entries(themeColors)) {
      root.style.setProperty(key, value as string);
    }
  }, [currentTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      if (dragItem.current?.type === 'tab') {
        document.body.style.cursor = 'grabbing';
      } else {
        document.body.style.cursor = 'default';
      }
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
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

  const addToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)); }, 7000);
  };

  const installTheme = (themeKey: string) => {
    if (!installedThemes.includes(themeKey)) {
      setInstalledThemes(prev => [...prev, themeKey]);
      // @ts-ignore
      const name = THEMES[themeKey]?.name || themeKey;
      addToast(`Theme installed: ${name}`, 'success');
    }
  };

  const uninstallTheme = (themeKey: string) => {
    setInstalledThemes(prev => prev.filter(t => t !== themeKey));
    // @ts-ignore
    const name = THEMES[themeKey]?.name || themeKey;
    addToast(`Theme uninstalled: ${name}`, 'info');

    // Safety: If the uninstalled theme was the active one, revert to default
    if (currentTheme === themeKey) {
      setCurrentTheme('darkModern');
      addToast('Active theme uninstalled. Reverting to Dark Modern.', 'warning');
    }
  };

  const openFile = useCallback((file: any) => {
    const existingWindow = windows.find(w => w.id === file.id);
    if (existingWindow) {
      setWindows(prev => prev.map(w => w.id === file.id ? { ...w, zIndex: 100, isMinimized: false } : { ...w, zIndex: 40 }));
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

  const toggleMinimize = (e: React.MouseEvent | null, id: string) => {
    e?.stopPropagation();
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
  };

  const closeTab = (e: React.MouseEvent | null, id: string) => {
    e?.stopPropagation();
    e?.stopPropagation();
    // if (id === 'home') return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id && newTabs.length > 0) setActiveTabId(newTabs[newTabs.length - 1].id);
  };

  const closeOtherTabs = (id: string) => {
    const newTabs = tabs.filter(t => t.id === id || t.id === 'home');
    setTabs(newTabs);
    setActiveTabId(id);
  };

  const closeWindow = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const toggleMaximize = (e: React.MouseEvent, id: string) => {
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
    const handler = (e: any) => {
      const { id, file } = e.detail;
      draggingTabId.current = id;
      dragItem.current = {
        type: 'explorer-drag',
        id,
        title: file.title,
        startX: 0,
        startY: 0,
        initialPos: null,
        initialSize: null,
        hasDetached: false,
        file: file
      };
      setIsDragging(true);
      // openFile(file); // Don't necessarily open on drag start
    };
    window.addEventListener('explorer-drag-start', handler);
    return () => window.removeEventListener('explorer-drag-start', handler);
  }, [openFile]);

  const handleContextMenu = (e: React.MouseEvent, type: string, id: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, type, id });
  };

  const handleMouseDown = (e: React.MouseEvent, type: string, id: string, extra: any = {}) => {
    if (type !== 'focus') {
      e.preventDefault();
    }
    e.stopPropagation();
    if (e.button !== 0) return;

    const activeWindow = windows.find(w => w.id === id);

    if (type === 'focus' || type === 'window') {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: 100 } : { ...w, zIndex: 40 }));
      if (type === 'focus') return;
    }

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

    const handleDragStartCheck = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - e.clientX;
      const dy = moveEvent.clientY - e.clientY;
      if (Math.hypot(dx, dy) > 5) {
        setIsDragging(true);
        window.removeEventListener('mousemove', handleDragStartCheck);
        window.removeEventListener('mouseup', handleDragEndCheck);
      }
    };

    const handleDragEndCheck = () => {
      window.removeEventListener('mousemove', handleDragStartCheck);
      window.removeEventListener('mouseup', handleDragEndCheck);
      dragItem.current = null;
      draggingTabId.current = null;
    };

    window.addEventListener('mousemove', handleDragStartCheck);
    window.addEventListener('mouseup', handleDragEndCheck);
  };

  const getTabInsertIndexFromX = (clientX: number, excludeId: string) => {
    const tabElements = Object.entries(tabRefs.current)
      .filter(([id, el]) => id !== excludeId && !!el && document.body.contains(el))
      .map(([id, el]) => {
        // @ts-ignore
        const rect = el.getBoundingClientRect();
        return { id, center: rect.left + rect.width / 2 };
      })
      .sort((a, b) => a.center - b.center);

    if (tabElements.length === 0) return 0;
    const index = tabElements.findIndex(t => clientX < t.center);
    if (index === -1) return tabElements.length;
    return index;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragItem.current) return;
    setMousePos({ x: e.clientX, y: e.clientY });

    const { type, id, startX, startY, initialPos, initialSize, hasDetached, dir } = dragItem.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (type === 'tab') {
      // if (id === 'home') return; // Allow dragging home tab
      let isOverTabBar = false;
      if (tabBarRef.current) {
        const barRect = tabBarRef.current.getBoundingClientRect();
        isOverTabBar = e.clientY >= barRect.top - 20 && e.clientY <= barRect.bottom + 20;
      }

      if (isOverTabBar) {
        // @ts-ignore
        const idx = getTabInsertIndexFromX(e.clientX, draggingTabId.current);
        setDropIndex(idx);
      } else {
        setDropIndex(null);
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

    if (type === 'explorer-drag') {
      let isOverTabBar = false;
      if (tabBarRef.current) {
        const barRect = tabBarRef.current.getBoundingClientRect();
        isOverTabBar = e.clientY >= barRect.top - 20 && e.clientY <= barRect.bottom + 20;
      }

      if (isOverTabBar) {
        // @ts-ignore
        const idx = getTabInsertIndexFromX(e.clientX, '');
        setDropIndex(idx);
      } else {
        setDropIndex(null);
      }
    }

    if (type === 'window') {
      const activeWindow = windows.find(w => w.id === id);
      if (activeWindow && activeWindow.isMaximized) {
        const restoredW = activeWindow.prevSize?.w || 600;
        const newX = e.clientX - (restoredW / 2);
        const newY = e.clientY;
        dragItem.current.initialPos = { x: newX, y: newY };
        dragItem.current.startX = e.clientX;
        dragItem.current.startY = e.clientY;
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: false, size: w.prevSize || { w: 600, h: 400 }, position: { x: newX, y: newY } } : w));
        return;
      }

      let newX = initialPos.x + dx;
      let newY = initialPos.y + dy;
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const windowWidth = activeWindow?.size.w || 600;
      const TITLE_BAR_HEIGHT = 32;
      const VISIBLE_MARGIN = 40;

      newX = Math.max(VISIBLE_MARGIN - windowWidth, Math.min(newX, viewportW - VISIBLE_MARGIN));
      newY = Math.max(0, Math.min(newY, viewportH - TITLE_BAR_HEIGHT));

      setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x: newX, y: newY } } : w));

      // SHOW DROP INDICATOR IN TAB BAR IF HOVERING
      let isOverTabBar = false;
      if (tabBarRef.current) {
        const barRect = tabBarRef.current.getBoundingClientRect();
        isOverTabBar = e.clientY >= barRect.top && e.clientY <= barRect.bottom + 30;
      }

      if (isOverTabBar) {
        // @ts-ignore
        const idx = getTabInsertIndexFromX(e.clientX, '');
        setDropIndex(idx);
      } else {
        setDropIndex(null);
      }

      if (e.clientY < 60 && !isOverTabBar) setDockHighlight(true); else setDockHighlight(false);
    }

    if (type === 'resize') {
      let newX = initialPos.x;
      let newY = initialPos.y;
      let newW = initialSize.w;
      let newH = initialSize.h;

      if (dir.includes('e')) {
        newW = Math.max(300, initialSize.w + dx);
      } else if (dir.includes('w')) {
        const possibleW = initialSize.w - dx;
        if (possibleW > 300) {
          newX = initialPos.x + dx;
          newW = possibleW;
        }
      }

      if (dir.includes('s')) {
        newH = Math.max(200, initialSize.h + dy);
      } else if (dir.includes('n')) {
        const possibleH = initialSize.h - dy;
        if (possibleH > 200) {
          newY = Math.max(0, initialPos.y + dy);
          newH = initialSize.h + (initialPos.y - newY);
        }
      }

      setWindows(prev => prev.map(w => w.id === id ? {
        ...w,
        position: { x: newX, y: newY },
        size: { w: newW, h: newH }
      } : w));
    }
  }, [isDragging, tabs, activeTabId, windows]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    setDropIndex(null);
    if (!isDragging || !dragItem.current) return;
    const { type, id } = dragItem.current;

    if (type === 'tab' && draggingTabId.current) {
      const dragId = draggingTabId.current;
      setTabs(prev => {
        const draggedItem = prev.find(t => t.id === dragId);
        if (!draggedItem) return prev;
        const filtered = prev.filter(t => t.id !== dragId);
        // @ts-ignore
        const insertIndex = getTabInsertIndexFromX(e.clientX, dragId);
        if (insertIndex == null) return prev;
        const next = [...filtered];
        next.splice(insertIndex, 0, draggedItem);
        return next;
      });
      setActiveTabId(dragId);
    }

    if (type === 'window' && tabBarRef.current && (() => { const r = tabBarRef.current!.getBoundingClientRect(); return e.clientY >= r.top && e.clientY <= r.bottom + 20; })()) {
      const win = windows.find(w => w.id === id);
      if (!win) return;
      setWindows(prev => prev.filter(w => w.id !== id));
      setTabs(prev => {
        // @ts-ignore
        const insertIndex = getTabInsertIndexFromX(e.clientX, id);
        if (insertIndex == null) return [...prev, win];
        const next = [...prev];
        next.splice(insertIndex, 0, win);
        return next;
      });
      setActiveTabId(id);
    }

    if (type === 'explorer-drag' && tabBarRef.current && (() => { const r = tabBarRef.current!.getBoundingClientRect(); return e.clientY >= r.top - 20 && e.clientY <= r.bottom + 20; })()) {
      const file = dragItem.current.file;
      if (file) {
        // Determine where to insert the new tab
        // @ts-ignore
        const insertIndex = getTabInsertIndexFromX(e.clientX, '');

        setTabs(prev => {
          const existing = prev.find(t => t.id === file.id);
          if (existing) {
            // If already open, just move it
            const filtered = prev.filter(t => t.id !== file.id);
            const next = [...filtered];
            next.splice(insertIndex, 0, existing);
            return next;
          }
          const next = [...prev];
          next.splice(insertIndex, 0, file);
          return next;
        });
        setActiveTabId(file.id);
      }
    }

    setIsDragging(false);
    setDockHighlight(false);
    dragItem.current = null;
    draggingTabId.current = null;
  }, [isDragging, windows, tabs, activeTabId]);

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
    <ThemeContext.Provider value={{
      theme: currentTheme,
      setTheme: setCurrentTheme,
      installedThemes,
      installTheme,
      uninstallTheme,
      homepageLayout,
      setHomepageLayout
    }}>
      <div className="h-screen w-full bg-[var(--bg-main)] text-[var(--text-primary)] font-sans overflow-hidden flex flex-col selection:bg-[var(--selection)] selection:text-white transition-colors duration-300">
        <div className="flex-1 flex min-h-0 relative">
          <CodeRainBackground />
          <CustomScrollbarStyles />
          <ToastContainer toasts={toasts} onClose={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              type={contextMenu.type as any}
              id={contextMenu.id}
              onClose={() => setContextMenu(null)}
              onAction={(action, id) => {
                if (action === 'close') closeTab(null, id);
                if (action === 'closeOthers') closeOtherTabs(id);
                if (action === 'copyPath') addToast('Path copied to clipboard');
                if (action === 'newFile') addToast('New file feature coming soon...');
                if (action === 'delete') addToast('Delete feature coming soon...', 'warning');
              }}
            />
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
            onContextMenu={handleContextMenu}
            isDragging={isDragging}
          />

          <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden min-w-0">
            <div
              ref={(el) => { tabScrollRef.current = el; tabBarRef.current = el; }}
              onWheel={(e) => { if (e.deltaY !== 0) { e.preventDefault(); e.currentTarget.scrollLeft += e.deltaY; } }}
              className={`h-9 bg-[var(--bg-activity)] border-b border-[var(--border)] flex items-center overflow-x-auto overflow-y-hidden relative shrink-0 whitespace-nowrap custom-scrollbar ${dockHighlight ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-fg)]' : ''}`}
            >
              {dockHighlight && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-[var(--bg-main)]/80 text-[var(--accent)] font-mono text-xs z-50">
                  <ArrowLeft size={14} className="rotate-90 mr-2" /> Release to Dock
                </div>
              )}
              {(() => {
                const draggingIndex = (isDragging && dragItem.current?.type === 'tab') ? tabs.findIndex(t => t.id === draggingTabId.current) : -1;
                const visualDropIndex = (dropIndex !== null && draggingIndex !== -1 && dropIndex > draggingIndex) ? dropIndex + 1 : dropIndex;
                const indicatorColor = 'var(--text-primary)'; // Theme-aware: white in dark mode, dark in light mode
                const indicatorStyle = {
                  backgroundColor: indicatorColor,
                  width: '2px', // VS Code uses a 2px indicator
                  transition: 'none', // ENSURE INSTANT MOVEMENT
                };
                return (
                  <>
                    {tabs.map((tab, i) => (
                      <React.Fragment key={tab.id}>
                        {visualDropIndex === i && <div style={indicatorStyle} className="h-6 mx-0 shrink-0 z-50" />}
                        <div
                          key={tab.id}
                          ref={(el) => { if (el) tabRefs.current[tab.id] = el; }}
                          onMouseDown={(e) => { draggingTabId.current = tab.id; handleMouseDown(e, 'tab', tab.id); }}
                          onClick={() => setActiveTabId(tab.id)}
                          onContextMenu={(e) => handleContextMenu(e, 'tab', tab.id)}
                          className={`
                            group relative px-3 h-full text-[11px] md:text-[13px] border-r border-[var(--border)] flex items-center gap-2 cursor-pointer select-none min-w-[120px] max-w-[200px] shrink-0
                            ${activeTabId === tab.id
                              ? 'bg-[var(--bg-main)] text-[var(--text-primary)] border-t border-t-[var(--accent)] z-10'
                              : 'bg-[var(--bg-activity)] text-[var(--text-secondary)] hover:bg-[var(--bg-main)]/30'}
                            ${isDragging && dragItem.current?.type === 'tab' && draggingTabId.current === tab.id ? 'opacity-30 grayscale' : 'opacity-100'}
                          `}
                        >
                          {(() => {
                            const { icon: Icon, color } = getFileIcon(tab.title);
                            return <Icon size={14} className={color} />;
                          })()}
                          <span className="truncate flex-1">{tab.title}</span>
                          {/* Allow closing home tab */}
                          <div
                            className={`w-5 h-5 flex items-center justify-center rounded hover:bg-[var(--border)] ${activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            onClick={(e) => closeTab(e, tab.id)}
                          >
                            <X size={14} />
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    {visualDropIndex === tabs.length && <div style={indicatorStyle} className="h-6 mx-0 shrink-0 z-50" />}
                    {/* Padding spacer to prevent last tab from being hidden by absolute layout controls */}
                    <div className="w-12 shrink-0 h-full pointer-events-none" />
                  </>
                );
              })()}
            </div>

            {/* Layout Controls */}
            <div className="absolute right-0 top-0 h-9 flex items-center px-3 bg-[var(--bg-activity)] border-b border-[var(--border)] z-20 shadow-[-10px_0_10px_-5px_var(--bg-activity)]">
              <button
                onClick={() => setIsSecondarySidebarOpen(!isSecondarySidebarOpen)}
                className={`p-1 rounded transition-colors ${isSecondarySidebarOpen ? 'text-[var(--accent-fg)] bg-[var(--accent)] hover:bg-[var(--accent)]/90' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)]'}`}
                title="Toggle Secondary Sidebar"
              >
                <PanelRight size={16} />
              </button>
            </div>
            <div
              ref={editorScrollRef}
              onScroll={(e) => { scrollPositions.current[activeTabId] = e.currentTarget.scrollTop; }}
              className="flex-1 bg-[var(--bg-main)] relative overflow-y-auto custom-scrollbar transition-colors duration-300"
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
              {tabs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-[var(--text-secondary)] select-none animate-in fade-in duration-500">
                  <div className="mb-8 opacity-20 hover:opacity-100 transition-opacity duration-700">
                    <Code size={120} strokeWidth={1} />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-[var(--accent)] tracking-tight">The Void of Creation</h2>
                  <p className="text-[var(--text-secondary)] mb-8 font-mono text-sm opacity-60">"Every great project starts with an empty buffer."</p>

                  <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm max-w-md mb-8">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[var(--text-primary)]">Command Palette</span>
                    </div>
                    <div className="flex flex-col items-start gap-1 font-mono text-[var(--text-secondary)]">
                      <span className="bg-[var(--bg-activity)] px-2 py-0.5 rounded border border-[var(--border)]">Ctrl+P</span>
                    </div>
                  </div>

                  {!windows.find(w => w.id === 'home') && (
                    <button
                      onClick={() => openFile({ id: 'home', title: 'home.tsx', type: 'home', data: null })}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--accent-fg)] rounded hover:bg-[var(--accent)]/90 transition-colors"
                    >
                      <Terminal size={14} />
                      <span>Reopen home.tsx</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            <IntegratedTerminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} onOpenFile={openFile} />
          </div>

          <SecondarySidebar isOpen={isSecondarySidebarOpen} activeTabId={activeTabId} onClose={() => setIsSecondarySidebarOpen(false)} />

          {windows.map(win => (
            <div
              key={win.id}
              style={{
                position: 'absolute',
                left: win.position.x,
                top: win.position.y,
                width: win.size.w,
                height: win.size.h,
                zIndex: win.zIndex || 40,
                // Disable transitions during dragging/resizing for performance
                transition: isDragging ? 'none' : 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseDown={(e) => handleMouseDown(e, 'focus', win.id)}
              className={`bg-[var(--bg-main)] border border-[var(--border)] rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden ring-1 ring-white/5 ${win.isMinimized ? 'hidden' : 'flex'}`}
            >
              {/* VS CODE AUTHENTIC TITLE BAR */}
              <div
                className="h-9 bg-[var(--bg-activity)] border-b border-[var(--border)] flex justify-between items-center px-1 cursor-default select-none shrink-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMouseDown(e, 'window', win.id);
                }}
                onDoubleClick={(e) => toggleMaximize(e, win.id)}
              >
                <div className="flex items-center gap-2.5 pl-2 text-[11px] font-sans text-[var(--text-secondary)]">
                  {(() => {
                    const { icon: Icon, color } = getFileIcon(win.title);
                    return (
                      <div className="flex items-center gap-2">
                        <Icon size={14} className={color} />
                        <span className="font-medium text-[var(--text-primary)] opacity-80">{win.title} — {win.type.toUpperCase()}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* WINDOW CONTROLS */}
                <div className="flex items-center h-full" onMouseDown={(e) => e.stopPropagation()}>
                  <div
                    className="w-11 h-full flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={(e) => toggleMinimize(e, win.id)}
                    title="Minimize"
                  >
                    <Minus size={14} />
                  </div>
                  <div
                    className="w-11 h-full flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={(e) => toggleMaximize(e, win.id)}
                    title={win.isMaximized ? "Restore" : "Maximize"}
                  >
                    {win.isMaximized ? <Minimize2 size={13} /> : <Square size={13} />}
                  </div>
                  <div
                    className="w-11 h-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[#e81123] hover:text-white transition-colors cursor-pointer"
                    onClick={(e) => closeWindow(e, win.id)}
                    title="Close"
                  >
                    <X size={16} />
                  </div>
                </div>
              </div>

              {/* WINDOW CONTENT AREA */}
              <div
                onScroll={(e) => { scrollPositions.current[win.id] = e.currentTarget.scrollTop; }}
                ref={(el) => { if (el) el.scrollTop = scrollPositions.current[win.id] ?? 0; }}
                className="flex-1 bg-[var(--bg-main)] overflow-y-auto custom-scrollbar"
              >
                <ContentRenderer
                  type={win.type}
                  data={win.data}
                  title={win.title}
                  content={win.content}
                  lang={win.lang}
                  onOpenFile={openFile}
                  editorSettings={editorSettings}
                />
              </div>

              {/* RESIZE HANDLES */}
              {!win.isMaximized && (
                <>
                  {/* Edges */}
                  <div className="absolute top-0 left-0 right-0 h-1 cursor-n-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'n' })} />
                  <div className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 's' })} />
                  <div className="absolute left-0 top-0 bottom-0 w-1 cursor-w-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'w' })} />
                  <div className="absolute right-0 top-0 bottom-0 w-1 cursor-e-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'e' })} />

                  {/* Corners */}
                  <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-[51]" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'nw' })} />
                  <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-[51]" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'ne' })} />
                  <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-[51]" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'sw' })} />
                  <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-[51]" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'se' })} />
                </>
              )}
            </div>
          ))}

        </div> {/* End of Top Section flex-1 flex */}

        <div className="h-6 bg-[var(--bg-status)] border-t border-[var(--border)] flex justify-between items-center px-3 text-[10px] md:text-xs font-sans text-[var(--fg-status)] z-30 relative shrink-0 transition-colors duration-300 select-none">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
              className="flex items-center gap-1 hover:text-[var(--fg-status)] cursor-pointer hover:bg-white/10 px-2 rounded transition-colors"
            >
              <Terminal size={10} />
              <span className="hidden sm:inline">TERMINAL</span>
            </button>
            <div className="hidden md:flex items-center gap-1 hover:opacity-80 cursor-pointer">
              <GitBranch size={10} />
              <span>main*</span>
            </div>
            <div className="hidden md:flex items-center gap-1 hover:opacity-80 cursor-pointer">
              <AlertCircle size={10} />
              <span>0 errors</span>
            </div>
          </div>
          <div className="hidden md:flex gap-4 items-center">
            <span className="hover:opacity-80 cursor-pointer">Ln 12, Col 45</span>
            <span className="hover:opacity-80 cursor-pointer">UTF-8</span>
            <span className="hover:opacity-80 cursor-pointer flex items-center gap-1">
              <CheckCircle size={10} /> Prettier
            </span>
            <button
              onClick={() => setToasts([])}
              className="hover:opacity-80 cursor-pointer flex items-center gap-1 relative"
            >
              <Bell size={10} />
              {toasts.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[12px] h-[12px] flex items-center justify-center bg-[var(--accent)] text-[var(--accent-fg)] text-[8px] rounded-full px-0.5 shadow-sm">
                  {toasts.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} onOpenFile={openFile} />
        {
          isDragging && dragItem.current && (dragItem.current.type === 'tab' || dragItem.current.type === 'explorer-drag') && (
            <div
              style={{
                position: 'fixed',
                left: mousePos.x + 10,
                top: mousePos.y + 10,
                zIndex: 9999,
                pointerEvents: 'none',
                // VS Code style dragging tab: utilitaran, no blur, crisp
                background: 'var(--bg-main)',
                opacity: 0.85,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                border: '1px solid var(--border)',
                height: '32px' // Match VS Code tab height
              }}
              className="flex items-center gap-2 text-[var(--text-primary)] text-[13px] px-3 py-0 rounded-none border-t-2 border-t-[var(--accent)]"
            >
              {(() => {
                const { type, id, title } = dragItem.current;
                let name = title;
                if (type === 'tab' || type === 'window') {
                  const item = tabs.find(t => t.id === id) || windows.find(w => w.id === id);
                  name = item?.title || id;
                }
                const { icon: Icon, color } = getFileIcon(name || '');
                return (
                  <>
                    <Icon size={16} className={color} />
                    <span className="font-sans">{name}</span>
                  </>
                );
              })()}
            </div>
          )
        }

        {/* WINDOW DOCK / TASKBAR FOR MINIMIZED WINDOWS */}
        {windows.some(w => w.isMinimized) && (
          <div className="fixed bottom-7 right-3 flex flex-col items-end gap-1 z-[60] pointer-events-none animate-in slide-in-from-right-2 duration-200">
            <div className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter mb-0.5 opacity-40 px-1 pointer-events-none select-none">
              Running Process
            </div>
            {windows.filter(w => w.isMinimized).map(win => (
              <div
                key={win.id}
                onClick={(e) => toggleMinimize(e, win.id)}
                className="pointer-events-auto bg-[var(--bg-panel)] border border-[var(--border)] px-3 h-8 flex items-center gap-3 cursor-pointer hover:bg-[var(--bg-activity)] transition-colors shadow-2xl group rounded-none w-52 border-l-2 border-l-[var(--accent)]/30 hover:border-l-[var(--accent)]"
              >
                {(() => {
                  const { icon: Icon, color } = getFileIcon(win.title);
                  return <Icon size={14} className={`${color} opacity-80 group-hover:opacity-100`} />;
                })()}
                <span className="text-[11px] font-sans text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] truncate flex-1">{win.title}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-20 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[8px] font-mono text-[var(--text-secondary)] opacity-30 group-hover:opacity-60 hidden sm:block">RESTORE</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div >
    </ThemeContext.Provider >
  );
};

export default App;