import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    Files, Search, GitBranch, Blocks, UserCircle, Settings2,
    MoreHorizontal as MoreHorizontalIcon, ChevronDown, Folder, FolderOpen,
    FileText, RefreshCw, Plus, CheckCircle, ToggleRight, ToggleLeft, Palette, FileJson
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { PROJECTS_DATA } from '../../data/projects';
import { FILE_CONTENTS, getFileIcon } from '../../data/fileSystem';
import { THEMES } from '../../data/themes';
import { FileTreeItem } from './FileTreeItem';

interface SidebarProps {
    onOpenFile: (file: any) => void;
    onToast: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
    onToggleTerminal: () => void;
    tabs: any[];
    activeTabId: string;
    setActiveTabId: React.Dispatch<React.SetStateAction<string>>;
    setTabs: React.Dispatch<React.SetStateAction<any[]>>;
    editorSettings: any;
    setEditorSettings: React.Dispatch<React.SetStateAction<any>>;
    onContextMenu: (e: React.MouseEvent, type: string, id: string) => void;
    isDragging: boolean;
}

export const Sidebar = ({
    onOpenFile,
    onToast,
    onToggleTerminal,
    tabs,
    activeTabId,
    setActiveTabId,
    setTabs,
    editorSettings,
    setEditorSettings,
    onContextMenu,
    isDragging
}: SidebarProps) => {

    const { theme, setTheme } = useContext(ThemeContext);
    const [activeView, setActiveView] = useState<'explorer' | 'search' | 'git' | 'extensions' | 'account' | 'settings'>('explorer');
    const [isPanelVisible, setIsPanelVisible] = useState(() => {
        const saved = localStorage.getItem('portfolio_sidebar_visible');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('portfolio_sidebar_visible', JSON.stringify(isPanelVisible));
    }, [isPanelVisible]);
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
        'src': true,
        'components': false,
        'pages': true,
        'projects': false,
        'recruiter': true
    });
    const [isExplorerMenuOpen, setIsExplorerMenuOpen] = useState(false);
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    const explorerMenuRef = useRef<HTMLDivElement>(null);

    const [sidebarWidth, setSidebarWidth] = useState(() => {
        const saved = localStorage.getItem('portfolio_sidebar_width');
        return saved ? parseInt(saved, 10) : 240;
    });
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Persist width changes
    useEffect(() => {
        localStorage.setItem('portfolio_sidebar_width', sidebarWidth.toString());
    }, [sidebarWidth]);

    const startResizing = React.useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    const stopResizing = React.useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = React.useCallback((e: MouseEvent) => {
        if (isResizing) {
            const newWidth = e.clientX - 48; // Subtract Activity Bar width (48px)
            if (newWidth > 170 && newWidth < 600) {
                setSidebarWidth(newWidth);
            }
        }
    }, [isResizing]);

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    useEffect(() => {
        // Prevent text selection while resizing
        if (isResizing) {
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    }, [isResizing]);

    const [searchQuery, setSearchQuery] = useState('');
    const [stagedFiles, setStagedFiles] = useState(['resume_old.pdf', 'resume_new.pdf']);
    const [installedExtensions, setInstalledExtensions] = useState<Record<string, boolean>>({
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

    const handleActivityClick = (view: 'explorer' | 'search' | 'git' | 'extensions' | 'account' | 'settings') => {
        if (activeView === view) {
            setIsPanelVisible(!isPanelVisible);
        } else {
            setActiveView(view);
            setIsPanelVisible(true);
        }
    };

    const toggleFolder = (folder: string) => {
        setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
    };

    const toggleExtension = (name: string) => {
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

    const toggleSetting = (key: string) => {
        if (key === "Minimap") {
            setEditorSettings((prev: any) => ({
                ...prev,
                minimap: !prev.minimap
            }));
            onToast(`Minimap ${editorSettings.minimap ? "disabled" : "enabled"}`, "info");
            return;
        }

        if (key === "Word Wrap") {
            setEditorSettings((prev: any) => ({
                ...prev,
                wordWrap: !prev.wordWrap
            }));
            onToast(`Word wrap ${editorSettings.wordWrap ? "disabled" : "enabled"}`, "info");
            return;
        }
    };


    const stageFile = (file: string) => {
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

    const renderFileTreeItem = (props: {
        id: string;
        name: string;
        icon: any;
        color: string;
        type: 'file' | 'folder';
        depth: number;
        hasChildren?: boolean;
        isOpen?: boolean;
        onToggle?: () => void;
        onClick?: () => void;
        onDragStart?: (e: React.MouseEvent, id: string) => void;
        showClose?: boolean;
        onClose?: () => void;
    }) => (
        <FileTreeItem
            key={props.id}
            depth={props.depth}
            name={props.name}
            icon={props.icon}
            color={props.color}
            draggableId={props.id}
            hasChildren={props.hasChildren}
            isOpen={props.isOpen}
            onToggle={props.onToggle}
            isActive={activeTabId === props.id}
            onClick={props.onClick}
            onContextMenu={(e) => onContextMenu(e, props.type === 'file' ? 'explorer-file' : 'explorer-folder', props.id)}
            isDragOver={isDragging && dragOverId === props.id}
            onMouseEnter={() => isDragging && setDragOverId(props.id)}
            onMouseLeave={() => setDragOverId(null)}
            onDragStart={props.onDragStart}
            showClose={props.showClose}
            onClose={props.onClose}
        />
    );

    const filteredProjects = PROJECTS_DATA.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full border-r border-[var(--border)] bg-[var(--bg-activity)] z-30 relative shrink-0 transition-colors duration-300">

            {/* ACTIVITY BAR */}
            <div className="w-12 flex flex-col items-center py-4 bg-[var(--bg-activity)] border-r border-[var(--border)] z-30 relative transition-colors duration-300">
                <div
                    className={`w-full h-12 flex items-center justify-center cursor-pointer transition-all relative ${activeView === 'explorer' && isPanelVisible ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    onClick={() => handleActivityClick('explorer')}
                    title="Explorer"
                >
                    {activeView === 'explorer' && isPanelVisible && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]" />}
                    <Files size={24} strokeWidth={1.5} />
                </div>
                <div
                    className={`w-full h-12 flex items-center justify-center cursor-pointer transition-all relative ${activeView === 'search' && isPanelVisible ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    onClick={() => handleActivityClick('search')}
                    title="Search"
                >
                    {activeView === 'search' && isPanelVisible && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]" />}
                    <Search size={24} strokeWidth={1.5} />
                </div>
                <div
                    className={`w-full h-12 flex items-center justify-center cursor-pointer transition-all relative ${activeView === 'git' && isPanelVisible ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    onClick={() => handleActivityClick('git')}
                    title="Source Control"
                >
                    {activeView === 'git' && isPanelVisible && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]" />}
                    <GitBranch size={24} strokeWidth={1.5} />
                </div>
                <div
                    className={`w-full h-12 flex items-center justify-center cursor-pointer transition-all relative ${activeView === 'extensions' && isPanelVisible ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    onClick={() => handleActivityClick('extensions')}
                    title="Extensions"
                >
                    {activeView === 'extensions' && isPanelVisible && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]" />}
                    <Blocks size={24} strokeWidth={1.5} />
                </div>

                <div className="mt-auto w-full flex flex-col items-center">
                    <div
                        className={`w-full h-12 flex items-center justify-center cursor-pointer transition-all relative ${activeView === 'account' && isPanelVisible ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        onClick={() => handleActivityClick('account')}
                        title="Account"
                    >
                        {activeView === 'account' && isPanelVisible && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]" />}
                        <UserCircle size={24} strokeWidth={1.5} />
                    </div>
                    <div
                        className={`w-full h-12 flex items-center justify-center cursor-pointer transition-all relative ${activeView === 'settings' && isPanelVisible ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        onClick={() => handleActivityClick('settings')}
                        title="Settings"
                    >
                        {activeView === 'settings' && isPanelVisible && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]" />}
                        <Settings2 size={24} strokeWidth={1.5} />
                    </div>
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
            <div
                ref={sidebarRef}
                style={{ width: isPanelVisible ? sidebarWidth : 0 }}
                className={`
        flex flex-col bg-[var(--bg-panel)] border-r border-[var(--border)]
        fixed md:relative top-0 bottom-0 left-12 md:left-0 z-20 overflow-hidden
        ${!isResizing ? '' : ''}
        ${isPanelVisible ? '' : 'md:border-none'}
      `}>
                <div
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[var(--accent)] transition-colors z-50 opacity-0 hover:opacity-100"
                    onMouseDown={startResizing}
                />

                {/* EXPLORER VIEW */}
                {activeView === 'explorer' && (
                    <div className="flex-1 flex flex-col min-h-0 min-w-0">
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

                        <div className="flex-1 overflow-y-auto custom-scrollbar select-none">
                            {/* SECTION: OPEN EDITORS */}
                            <div
                                className="h-[22px] flex items-center px-1 bg-[var(--bg-activity)]/30 cursor-pointer border-t border-white/5"
                                onClick={() => setExpandedFolders(prev => ({ ...prev, 'open_editors': !prev['open_editors'] }))}
                            >
                                <ChevronDown
                                    size={14}
                                    className={`text-[var(--text-secondary)] transition-transform duration-150 ${(expandedFolders['open_editors'] ?? true) ? '' : '-rotate-90'}`}
                                />
                                <span className="text-[11px] font-bold text-[var(--text-secondary)] ml-1 tracking-tight">OPEN EDITORS</span>
                            </div>

                            {(expandedFolders['open_editors'] ?? true) && (
                                <div className="mb-2">
                                    {tabs.map(tab => {
                                        const { icon, color } = getFileIcon(tab.title);
                                        return renderFileTreeItem({
                                            id: tab.id,
                                            name: tab.title,
                                            icon,
                                            color,
                                            type: 'file',
                                            depth: 0,
                                            onClick: () => setActiveTabId(tab.id),
                                            showClose: true,
                                            onDragStart: (_e, id) => {
                                                const tab = tabs.find(t => t.id === id);
                                                if (tab) {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: { id, file: tab }
                                                        })
                                                    );
                                                }
                                            },
                                            onClose: () => {
                                                // if (tab.id === 'home') return;
                                                const newTabs = tabs.filter(t => t.id !== tab.id);
                                                setTabs(newTabs);
                                                if (activeTabId === tab.id) {
                                                    const nextTab = newTabs[newTabs.length - 1];
                                                    setActiveTabId(nextTab ? nextTab.id : (null as any));
                                                }
                                            }
                                        });
                                    })}
                                </div>
                            )}

                            {/* SECTION: WORKSPACE (PORTFOLIO) */}
                            <div
                                className="h-[22px] flex items-center px-1 bg-[var(--bg-activity)]/30 cursor-pointer border-t border-white/5"
                                onClick={() => setExpandedFolders(prev => ({ ...prev, 'workspace': !prev['workspace'] }))}
                            >
                                <ChevronDown
                                    size={14}
                                    className={`text-[var(--text-secondary)] transition-transform duration-150 ${(expandedFolders['workspace'] ?? true) ? '' : '-rotate-90'}`}
                                />
                                <span className="text-[11px] font-bold text-[var(--text-secondary)] ml-1 tracking-tight uppercase">Portfolio</span>
                            </div>

                            {(expandedFolders['workspace'] ?? true) && (
                                <div className="py-1">

                                    {/* SRC Folder */}
                                    {renderFileTreeItem({
                                        id: 'src', name: 'src', icon: expandedFolders['src'] ? FolderOpen : Folder, color: "text-[var(--text-secondary)]",
                                        type: 'folder', depth: 0, hasChildren: true, isOpen: expandedFolders['src'], onToggle: () => toggleFolder('src')
                                    })}

                                    {expandedFolders['src'] && (
                                        <>
                                            {/* Projects Folder - uses Success Color */}
                                            {renderFileTreeItem({
                                                id: 'projects', name: 'projects', icon: expandedFolders['projects'] ? FolderOpen : Folder, color: "text-[var(--text-secondary)]",
                                                type: 'folder', depth: 1, hasChildren: true, isOpen: expandedFolders['projects'], onToggle: () => toggleFolder('projects')
                                            })}
                                            {expandedFolders['projects'] && PROJECTS_DATA.map(p => {
                                                const fileName = `${p.title}.tsx`;
                                                const fileMeta = getFileIcon(fileName);
                                                return renderFileTreeItem({
                                                    id: p.id,
                                                    name: fileName,
                                                    icon: fileMeta.icon,
                                                    color: fileMeta.color,
                                                    type: 'file',
                                                    depth: 2,
                                                    onDragStart: (_e, id) => {
                                                        window.dispatchEvent(
                                                            new CustomEvent("explorer-drag-start", {
                                                                detail: {
                                                                    id,
                                                                    file: { id: p.id, title: fileName, type: 'detail', data: p }
                                                                }
                                                            })
                                                        );
                                                    },
                                                    onClick: () => onOpenFile({
                                                        id: p.id,
                                                        title: fileName,
                                                        type: 'detail',
                                                        data: p
                                                    })
                                                });
                                            })}

                                            {/* Pages Folder - uses Warning Color */}
                                            {renderFileTreeItem({
                                                id: 'pages', name: 'pages', icon: expandedFolders['pages'] ? FolderOpen : Folder, color: "text-[var(--text-secondary)]",
                                                type: 'folder', depth: 1, hasChildren: true, isOpen: expandedFolders['pages'], onToggle: () => toggleFolder('pages')
                                            })}
                                            {expandedFolders['pages'] && (
                                                <>
                                                    {[
                                                        { name: "home.tsx", type: "home" },
                                                        { name: "projects.tsx", type: "projects" },
                                                    ].map(f => {
                                                        const meta = getFileIcon(f.name);
                                                        return renderFileTreeItem({
                                                            id: f.name,
                                                            name: f.name,
                                                            icon: meta.icon,
                                                            color: meta.color,
                                                            type: 'file',
                                                            depth: 2,
                                                            onDragStart: (_e, id) => {
                                                                window.dispatchEvent(
                                                                    new CustomEvent("explorer-drag-start", {
                                                                        detail: { id, file: { id: f.name, title: f.name, type: f.type } }
                                                                    })
                                                                );
                                                            },
                                                            onClick: () => onOpenFile({ id: f.name, title: f.name, type: f.type })
                                                        });
                                                    })}
                                                    {/* Projects JSON */}
                                                    {renderFileTreeItem({
                                                        id: 'projects_json',
                                                        name: 'projects.json',
                                                        icon: getFileIcon("projects.json").icon,
                                                        color: getFileIcon("projects.json").color,
                                                        type: 'file',
                                                        depth: 2,
                                                        onDragStart: (_e, id) => {
                                                            window.dispatchEvent(
                                                                new CustomEvent("explorer-drag-start", {
                                                                    detail: { id, file: { id: "projects_json", title: "projects.json", type: "code", content: FILE_CONTENTS.projects_json, lang: "json" } }
                                                                })
                                                            );
                                                        },
                                                        onClick: () =>
                                                            onOpenFile({
                                                                id: "projects_json",
                                                                title: "projects.json",
                                                                type: "code",
                                                                content: FILE_CONTENTS.projects_json,
                                                                lang: "json"
                                                            })
                                                    })}
                                                </>
                                            )}

                                            {/* Components Folder - uses Info Color */}
                                            {renderFileTreeItem({
                                                id: 'components', name: 'components', icon: expandedFolders['components'] ? FolderOpen : Folder, color: "text-[var(--text-secondary)]",
                                                type: 'folder', depth: 1, hasChildren: true, isOpen: expandedFolders['components'], onToggle: () => toggleFolder('components')
                                            })}
                                            {expandedFolders['components'] && (
                                                <>
                                                    {renderFileTreeItem({
                                                        id: 'terminal_comp',
                                                        name: 'Terminal.tsx',
                                                        icon: getFileIcon("Terminal.tsx").icon,
                                                        color: getFileIcon("Terminal.tsx").color,
                                                        type: 'file',
                                                        depth: 2,
                                                        onDragStart: (_e, id) => {
                                                            window.dispatchEvent(
                                                                new CustomEvent("explorer-drag-start", {
                                                                    detail: { id, file: { id: "terminal_comp", title: "Terminal.tsx", type: "code", content: FILE_CONTENTS.terminal_component, lang: "typescript" } }
                                                                })
                                                            );
                                                        },
                                                        onClick: () =>
                                                            onOpenFile({
                                                                id: "terminal_comp",
                                                                title: "Terminal.tsx",
                                                                type: "code",
                                                                content: FILE_CONTENTS.terminal_component,
                                                                lang: "typescript"
                                                            })
                                                    })}

                                                    {renderFileTreeItem({
                                                        id: 'window_comp',
                                                        name: 'Window.tsx',
                                                        icon: getFileIcon("Window.tsx").icon,
                                                        color: getFileIcon("Window.tsx").color,
                                                        type: 'file',
                                                        depth: 2,
                                                        onDragStart: (_e, id) => {
                                                            window.dispatchEvent(
                                                                new CustomEvent("explorer-drag-start", {
                                                                    detail: { id, file: { id: "window_comp", title: "Window.tsx", type: "code", content: FILE_CONTENTS.window_component, lang: "typescript" } }
                                                                })
                                                            );
                                                        },
                                                        onClick: () =>
                                                            onOpenFile({
                                                                id: "window_comp",
                                                                title: "Window.tsx",
                                                                type: "code",
                                                                content: FILE_CONTENTS.window_component,
                                                                lang: "typescript"
                                                            })
                                                    })}

                                                    {renderFileTreeItem({
                                                        id: 'word_wrap_from_hell',
                                                        name: 'word_wrap_from_hell.json',
                                                        icon: getFileIcon("word_wrap_from_hell.json").icon,
                                                        color: getFileIcon("word_wrap_from_hell.json").color,
                                                        type: 'file',
                                                        depth: 2,
                                                        onDragStart: (_e, id) => {
                                                            window.dispatchEvent(
                                                                new CustomEvent("explorer-drag-start", {
                                                                    detail: { id, file: { id, title: "components/word_wrap_from_hell.json", type: "code", content: FILE_CONTENTS.word_wrap_from_hell, lang: "json" } }
                                                                })
                                                            );
                                                        },
                                                        onClick: () =>
                                                            onOpenFile({
                                                                id: "word_wrap_from_hell",
                                                                title: "components/word_wrap_from_hell.json",
                                                                type: "code",
                                                                content: FILE_CONTENTS.word_wrap_from_hell,
                                                                lang: "json"
                                                            })
                                                    })}

                                                    {renderFileTreeItem({
                                                        id: 'minimap_stress_test',
                                                        name: 'minimap_stress_test.json',
                                                        icon: getFileIcon("minimap_stress_test.json").icon,
                                                        color: getFileIcon("minimap_stress_test.json").color,
                                                        type: 'file',
                                                        depth: 2,
                                                        onDragStart: (_e, id) => {
                                                            window.dispatchEvent(
                                                                new CustomEvent("explorer-drag-start", {
                                                                    detail: { id, file: { id: "minimap_stress_test", title: "components/minimap_stress_test.json", type: "code", content: FILE_CONTENTS.minimap_stress_test, lang: "json" } }
                                                                })
                                                            );
                                                        },
                                                        onClick: () =>
                                                            onOpenFile({
                                                                id: "minimap_stress_test",
                                                                title: "components/minimap_stress_test.json",
                                                                type: "code",
                                                                content: FILE_CONTENTS.minimap_stress_test,
                                                                lang: "json"
                                                            })
                                                    })}
                                                </>
                                            )}
                                        </>
                                    )}

                                    {[
                                        { name: ".env", type: 'code', content: FILE_CONTENTS.env, lang: 'bash' },
                                        { name: ".gitignore", type: 'code', content: FILE_CONTENTS.gitignore, lang: 'bash' },
                                        { name: "package.json", type: "code", content: FILE_CONTENTS.package_json, lang: "json" },
                                        { name: "README.md", type: 'readme', content: FILE_CONTENTS.readme }
                                    ].map(f => {
                                        const fileMeta = getFileIcon(f.name);
                                        return renderFileTreeItem({
                                            id: f.name,
                                            name: f.name,
                                            icon: fileMeta.icon,
                                            color: fileMeta.color,
                                            type: 'file',
                                            depth: 0,
                                            onDragStart: (_e, id) => {
                                                window.dispatchEvent(
                                                    new CustomEvent("explorer-drag-start", {
                                                        detail: { id, file: { id: f.name, title: f.name, type: f.type, content: f.content, lang: f.lang } }
                                                    })
                                                );
                                            },
                                            onClick: () =>
                                                onOpenFile({
                                                    id: f.name,
                                                    title: f.name,
                                                    type: f.type,
                                                    content: f.content,
                                                    lang: f.lang
                                                })
                                        });
                                    })}

                                    {/* Recruiter Folder - uses Info Color */}
                                    {renderFileTreeItem({
                                        id: 'recruiter', name: 'recruiter', icon: expandedFolders['recruiter'] ? FolderOpen : Folder, color: "text-[var(--text-secondary)]",
                                        type: 'folder', depth: 0, hasChildren: true, isOpen: expandedFolders['recruiter'], onToggle: () => toggleFolder('recruiter')
                                    })}
                                    {expandedFolders['recruiter'] && (
                                        <>
                                            {[
                                                { name: "hire_me.json", content: FILE_CONTENTS.hire_me, lang: 'json' },
                                                { name: "skills.json", content: FILE_CONTENTS.skills_json, lang: 'json' },
                                                { name: "career_path.txt", content: FILE_CONTENTS.career_path, lang: 'text' }
                                            ].map(f => {
                                                const fileMeta = getFileIcon(f.name);
                                                return renderFileTreeItem({
                                                    id: `recruiter_${f.name}`,
                                                    name: f.name,
                                                    icon: fileMeta.icon,
                                                    color: fileMeta.color,
                                                    type: 'file',
                                                    depth: 1,
                                                    onDragStart: (_e, id) => {
                                                        window.dispatchEvent(
                                                            new CustomEvent("explorer-drag-start", {
                                                                detail: { id, file: { id: `recruiter_${f.name}`, title: `recruiter/${f.name}`, type: "code", content: f.content, lang: f.lang } }
                                                            })
                                                        );
                                                    },
                                                    onClick: () =>
                                                        onOpenFile({
                                                            id: `recruiter_${f.name}`,
                                                            title: `recruiter/${f.name}`,
                                                            type: "code",
                                                            content: f.content,
                                                            lang: f.lang
                                                        })
                                                });
                                            })}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SEARCH VIEW */}
                {activeView === 'search' && (
                    <div className="flex-1 flex flex-col p-4 min-w-0">
                        <div className="text-xs font-bold text-[var(--text-secondary)] mb-4 tracking-wider">SEARCH</div>
                        <div className="relative mb-4">
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search projects..."
                                className="w-full bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-xs p-2 pl-8 focus:outline-none focus:border-[var(--accent)]"
                            />
                            <Search size={12} className="absolute left-2.5 top-2.5 text-slate-500" />
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {searchQuery && filteredProjects.map(p => (
                                <div key={p.id} onClick={() => onOpenFile({ id: p.id, title: `${p.title}.tsx`, type: 'detail', data: p })} className="group cursor-pointer mb-3 hover:bg-[var(--bg-activity)] p-2">
                                    <div className="flex items-center gap-2 text-xs text-[var(--text-primary)] group-hover:text-[var(--accent)] font-mono mb-1">
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
                    <div className="flex-1 flex flex-col p-4 min-w-0">
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
                                    <FileText size={14} className="text-[var(--warning)]" />
                                    <span className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{file}</span>
                                    <span onClick={() => stageFile(file)} className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--success)] ml-auto flex items-center gap-1">
                                        <Plus size={10} />
                                    </span>
                                </div>
                            ))}
                            {stagedFiles.length === 0 && <div className="text-xs text-[var(--text-secondary)] italic pl-2">All changes staged.</div>}
                        </div>
                        <div className="mt-6">
                            <input placeholder="Message (Ctrl+Enter)" className="w-full bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-xs p-2 focus:outline-none focus:border-[var(--accent)]" />
                            <button
                                onClick={handleCommit}
                                className="w-full mt-2 bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-white text-xs py-1.5 flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={12} /> Commit
                            </button>
                        </div>
                    </div>
                )}

                {/* EXTENSIONS VIEW */}
                {activeView === 'extensions' && (
                    <div className="flex-1 flex flex-col p-4 min-w-0">
                        <div className="text-xs font-bold text-[var(--text-secondary)] mb-4 tracking-wider">EXTENSIONS</div>
                        <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
                            {Object.entries(installedExtensions).map(([name, installed], i) => (
                                <div key={i} className="flex gap-3 hover:bg-[var(--bg-activity)] p-2 rounded cursor-default group">
                                    <div className="w-8 h-8 bg-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center rounded shrink-0">
                                        <Blocks size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="text-xs font-bold text-[var(--text-primary)] truncate">{name}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleExtension(name)}
                                                className={`text-[9px] px-1.5 py-0.5 rounded border ${installed ? 'bg-[var(--bg-activity)] border-[var(--border)] text-[var(--text-secondary)]' : 'bg-[var(--accent)] border-[var(--accent)] text-white'}`}
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
                    <div className="flex-1 flex flex-col p-4 min-w-0">
                        <div className="text-xs font-bold text-[var(--text-secondary)] mb-4 tracking-wider">SETTINGS</div>

                        <div className="space-y-4 mb-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-[var(--text-primary)]">Word Wrap</span>
                                <button onClick={() => toggleSetting("Word Wrap")}>
                                    {editorSettings.wordWrap
                                        ? <ToggleRight size={24} className="text-[var(--accent)]" />
                                        : <ToggleLeft size={24} />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-[var(--text-primary)]">Minimap</span>
                                <button onClick={() => toggleSetting("Minimap")}>
                                    {editorSettings.minimap
                                        ? <ToggleRight size={24} className="text-[var(--accent)]" />
                                        : <ToggleLeft size={24} />}
                                </button>
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
                                        className={`flex items-center gap-3 px-3 py-2 rounded border transition-all text-xs font-sans
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
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--hero-gradient-start)] to-[var(--hero-gradient-end)] flex items-center justify-center text-2xl font-bold text-white mb-4">
                            A
                        </div>
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">Arnav</h3>
                        <p className="text-xs text-[var(--text-secondary)] mb-6">Full Stack Engineer</p>

                        <div className="w-full space-y-2">
                            <button onClick={handleEditProfile} className="w-full py-1.5 text-xs bg-[var(--bg-activity)] hover:bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border)]">Edit Profile</button>
                            <button onClick={handleSignOut} className="w-full py-1.5 text-xs bg-[var(--bg-activity)] hover:bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border)]">Sign Out</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
