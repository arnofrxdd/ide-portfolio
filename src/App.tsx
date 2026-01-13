import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, MinusCircle, Copy as CopyIcon, ArrowLeft, Terminal, GitBranch,
  AlertCircle, CheckCircle, Bell, GripHorizontal, Minimize2, Square
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

const App = () => {
  const [tabs, setTabs] = useState<any[]>([{ id: 'home', title: 'home.tsx', type: 'home', data: null }]);
  const [activeTabId, setActiveTabId] = useState('home');
  const [windows, setWindows] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dockHighlight, setDockHighlight] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('portfolio_theme');
    // @ts-ignore
    return saved && THEMES[saved] ? saved : 'default';
  });

  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, type: string, id: string } | null>(null);
  const [toasts, setToasts] = useState<any[]>([]);

  const [editorSettings, setEditorSettings] = useState(() => {
    const saved = localStorage.getItem('portfolio_editor_settings');
    return saved ? JSON.parse(saved) : { minimap: true, wordWrap: false };
  });

  useEffect(() => {
    localStorage.setItem('portfolio_editor_settings', JSON.stringify(editorSettings));
  }, [editorSettings]);

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
      addToast(`Toggled ${key === 'wordWrap' ? 'Word Wrap' : 'Minimap'} ${newVal ? 'On' : 'Off'}`, 'info');
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

  const openFile = useCallback((file: any) => {
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

  const closeTab = (e: React.MouseEvent | null, id: string) => {
    e?.stopPropagation();
    if (id === 'home') return;
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
        type: 'tab',
        id,
        startX: 0,
        startY: 0,
        initialPos: null,
        initialSize: null,
        hasDetached: false
      };
      setIsDragging(true);
      openFile(file);
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
      if (id === 'home') return;
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
      if (e.clientY < 60) setDockHighlight(true); else setDockHighlight(false);
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
            className={`h-10 bg-[var(--bg-activity)] border-b border-[var(--border)] flex items-end px-2 gap-1 overflow-x-auto overflow-y-hidden relative transition-colors duration-300 shrink-0 whitespace-nowrap custom-scrollbar ${dockHighlight ? 'bg-[var(--accent)]/10 border-[var(--accent)]' : ''}`}
          >
            {dockHighlight && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-[var(--bg-main)]/80 text-[var(--accent)] font-mono text-xs z-50">
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
              className="h-8 bg-[var(--bg-activity)] border-b border-[var(--border)] flex justify-between items-center px-2 cursor-default select-none"
              onMouseDown={(e) => {
                e.preventDefault();
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
              ref={(el) => { if (el) el.scrollTop = scrollPositions.current[win.id] ?? 0; }}
              className="flex-1 bg-[var(--bg-panel)] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-700 custom-scrollbar"
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
            {!win.isMaximized && (
              <>
                <div className="absolute top-0 left-4 right-4 h-1 cursor-n-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'n' })} />
                <div className="absolute bottom-0 left-4 right-4 h-1 cursor-s-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 's' })} />
                <div className="absolute left-0 top-4 bottom-4 w-1 cursor-w-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'w' })} />
                <div className="absolute right-0 top-4 bottom-4 w-1 cursor-e-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'e' })} />
                <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'nw' })} />
                <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'ne' })} />
                <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'sw' })} />
                <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50" onMouseDown={(e) => handleMouseDown(e, 'resize', win.id, { action: 'resize', dir: 'se' })} />
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