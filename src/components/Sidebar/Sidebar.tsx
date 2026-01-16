import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    Files, Search, UserCircle, Settings2,
    MoreHorizontal as MoreHorizontalIcon, ChevronDown, Folder, FolderOpen,
    RefreshCw, Plus, CheckCircle, ToggleRight, ToggleLeft, FileJson,
    Cloud, ShieldCheck, LogOut, User, ChevronRight, CaseSensitive, WholeWord, Regex, RotateCcw, Globe, Trophy, Award, LayoutGrid, Filter, ExternalLink, Palette, Trash2
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { PROJECTS_DATA } from '../../data/projects';
import { FILE_CONTENTS, getFileIcon } from '../../data/fileSystem';
import { THEMES, THEME_CATEGORIES } from '../../data/themes';
import { ThemeMarketplace } from '../ThemeMarketplace/ThemeMarketplace';
import { FileTreeItem } from './FileTreeItem';

const ThemeCollapsibleGroup = ({
    title,
    themes,
    activeTheme,
    setTheme,
    uninstallTheme,
    search
}: {
    title: string,
    themes: [string, any][],
    activeTheme: string,
    setTheme: (k: string) => void,
    uninstallTheme: (k: string) => void,
    search: string
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const filteredThemes = themes.filter(([_, data]) =>
        data.name.toLowerCase().includes(search.toLowerCase()) ||
        "color theme".includes(search.toLowerCase())
    );

    if (filteredThemes.length === 0) return null;

    const isBuiltIn = (key: string) => ['darkModern', 'vscode', 'githubDark', 'nord', 'oneDarkPro', 'dracula'].includes(key) || title === 'Core Favorites';

    return (
        <div className="mb-px">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="h-[22px] flex items-center px-1 bg-[var(--bg-activity)]/40 cursor-pointer hover:bg-[var(--bg-activity)] transition-colors rounded-sm"
            >
                <ChevronDown
                    size={14}
                    className={`text-[var(--text-secondary)] transition-transform duration-150 ${isOpen ? '' : '-rotate-90'}`}
                />
                <span className="text-[10px] font-bold text-[var(--text-secondary)] ml-1 tracking-tight uppercase opacity-80">{title}</span>
                <span className="ml-auto text-[9px] text-[var(--text-secondary)] opacity-40 px-1.5">{filteredThemes.length}</span>
            </div>
            {isOpen && (
                <div className="grid grid-cols-1 gap-0.5 mt-1 pl-1">
                    {filteredThemes.map(([key, themeData]) => (
                        <button
                            key={key}
                            onClick={() => setTheme(key)}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-sm transition-all text-[11px] font-sans group
                                ${activeTheme === key
                                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-activity)] hover:text-[var(--text-primary)]'}
                            `}
                        >
                            <div
                                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0 overflow-hidden relative"
                                style={{ backgroundColor: themeData.colors['--bg-main'] }}
                            >
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: themeData.colors['--accent'],
                                        clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
                                    }}
                                />
                            </div>
                            <span className="truncate">{themeData.name}</span>
                            {activeTheme === key && <CheckCircle size={10} className="ml-auto" />}

                            {!isBuiltIn(key) && (
                                <div
                                    onClick={(e) => { e.stopPropagation(); uninstallTheme(key); }}
                                    className="ml-auto opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-0.5"
                                    title="Uninstall Theme"
                                >
                                    <Trash2 size={12} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

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

    const { theme, setTheme, homepageLayout, setHomepageLayout, installedThemes, uninstallTheme } = useContext(ThemeContext);
    const [activeView, setActiveView] = useState<'explorer' | 'search' | 'deployments' | 'certifications' | 'marketplace' | 'account' | 'settings'>('explorer');


    const [settingsSearch, setSettingsSearch] = useState('');
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
    const [searchModifiers, setSearchModifiers] = useState({ matchCase: false, wholeWord: false, regex: false });
    const [searchDetailsVisible, setSearchDetailsVisible] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState<Record<string, boolean>>({ 'results': true, 'details': false });
    const [deploymentsExpanded, setDeploymentsExpanded] = useState<Record<string, boolean>>({ 'services': true, 'infrastructure': true });



    const certifications = [
        {
            name: "AWS Solutions Architect",
            issuer: "Amazon Web Services",
            id: "aws-sa",
            description: "Validation of expertise in designing distributed systems on AWS.",
            status: "Certified",
            icon: Cloud
        },
        {
            name: "Meta Front-End Designer",
            issuer: "Meta / Coursera",
            id: "meta-fed",
            description: "Advanced proficiency in React, JS, and responsive UI/UX systems.",
            status: "Verified",
            icon: LayoutGrid
        },
        {
            name: "Google Cloud Engineer",
            issuer: "Google Cloud",
            id: "google-ace",
            description: "Associate level certification for cloud infrastructure management.",
            status: "Certified",
            icon: Globe
        },
        {
            name: "System Architect Award",
            issuer: "Tech Expo 2024",
            id: "award-24",
            description: "1st Place Winner for innovative distributed terminal architecture.",
            status: "Awarded",
            icon: Trophy
        }
    ];

    const [certSearch, setCertSearch] = useState('');
    const filteredCerts = certifications.filter(c =>
        c.name.toLowerCase().includes(certSearch.toLowerCase()) ||
        c.issuer.toLowerCase().includes(certSearch.toLowerCase())
    );

    const handleVerifyCert = (name: string) => {
        onToast(`Opening verification portal for ${name}...`, 'info');
        setTimeout(() => {
            onToast(`Verification Success: ${name} is valid.`, 'success');
        }, 1500);
    };


    const handleActivityClick = (view: 'explorer' | 'search' | 'deployments' | 'certifications' | 'marketplace' | 'account' | 'settings') => {
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

    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsPanelVisible(false);
        }
    }, []);


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




    const handleDeploy = (name: string) => {
        onToast(`Triggering manual deploy for ${name}...`, 'info');
        setTimeout(() => onToast(`${name} deployment successful!`, 'success'), 2000);
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
                    className={`w-full h-12 flex items-center justify-center cursor-pointer transition-all relative ${activeView === 'deployments' && isPanelVisible ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    onClick={() => handleActivityClick('deployments')}
                    title="Deployments"
                >
                    {activeView === 'deployments' && isPanelVisible && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]" />}
                    <Globe size={24} strokeWidth={1.5} />
                </div>
                <div
                    className={`w-full h-12 flex items-center justify-center cursor-pointer transition-all relative ${activeView === 'certifications' && isPanelVisible ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    onClick={() => handleActivityClick('certifications')}
                    title="Certifications"
                >
                    {activeView === 'certifications' && isPanelVisible && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]" />}
                    <Trophy size={24} strokeWidth={1.5} />
                </div>
                <div
                    className={`w-full h-12 flex items-center justify-center cursor-pointer transition-all relative ${activeView === 'marketplace' && isPanelVisible ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    onClick={() => handleActivityClick('marketplace')}
                    title="Theme Marketplace"
                >
                    {activeView === 'marketplace' && isPanelVisible && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]" />}
                    <Palette size={24} strokeWidth={1.5} />
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
                                        { name: "README.md", type: 'readme', content: FILE_CONTENTS.readme },
                                        { name: "resume.pdf", type: 'pdf' }
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
                    <div className="flex-1 flex flex-col min-h-0 min-w-0">
                        <div className="h-9 px-4 flex items-center justify-between text-[11px] font-bold text-[var(--text-secondary)] tracking-wider">
                            <span>SEARCH</span>
                            <div className="flex gap-2">
                                <RefreshCw size={14} className="hover:text-[var(--text-primary)] cursor-pointer" />
                                <ChevronRight size={14} className={`hover:text-[var(--text-primary)] cursor-pointer transition-transform ${searchDetailsVisible ? 'rotate-90' : ''}`} onClick={() => setSearchDetailsVisible(!searchDetailsVisible)} />
                            </div>
                        </div>

                        <div className="px-4 py-2">
                            <div className="flex flex-col gap-1">
                                {/* Search Input Box */}
                                <div className="relative group">
                                    <input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search"
                                        className="w-full bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-[13px] py-1 pl-2 pr-[70px] focus:outline-none focus:border-[var(--accent)] rounded-sm"
                                    />
                                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                                        <button
                                            onClick={() => setSearchModifiers(m => ({ ...m, matchCase: !m.matchCase }))}
                                            className={`p-1 rounded-sm hover:bg-[var(--bg-panel)] ${searchModifiers.matchCase ? 'bg-[var(--accent)]/20 text-[var(--accent)] ring-1 ring-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
                                            title="Match Case"
                                        >
                                            <CaseSensitive size={14} />
                                        </button>
                                        <button
                                            onClick={() => setSearchModifiers(m => ({ ...m, wholeWord: !m.wholeWord }))}
                                            className={`p-1 rounded-sm hover:bg-[var(--bg-panel)] ${searchModifiers.wholeWord ? 'bg-[var(--accent)]/20 text-[var(--accent)] ring-1 ring-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
                                            title="Match Whole Word"
                                        >
                                            <WholeWord size={14} />
                                        </button>
                                        <button
                                            onClick={() => setSearchModifiers(m => ({ ...m, regex: !m.regex }))}
                                            className={`p-1 rounded-sm hover:bg-[var(--bg-panel)] ${searchModifiers.regex ? 'bg-[var(--accent)]/20 text-[var(--accent)] ring-1 ring-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
                                            title="Use Regular Expression"
                                        >
                                            <Regex size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Files to include/exclude (collapsible) */}
                            {searchDetailsVisible && (
                                <div className="pl-5 space-y-2 pt-1 animate-in fade-in duration-300">
                                    <div className="space-y-1">
                                        <div className="text-[11px] text-[var(--text-secondary)] font-bold">files to include</div>
                                        <input className="w-full bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-[11px] p-1 focus:outline-none focus:border-[var(--accent)]" placeholder="e.g. *.ts, src/**" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[11px] text-[var(--text-secondary)] font-bold">files to exclude</div>
                                        <input className="w-full bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-[11px] p-1 focus:outline-none focus:border-[var(--accent)]" placeholder="e.g. node_modules/**" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Results */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div
                                className="h-[22px] flex items-center px-1 bg-[var(--bg-activity)]/30 cursor-pointer border-t border-white/5"
                                onClick={() => setSearchExpanded(prev => ({ ...prev, 'results': !prev['results'] }))}
                            >
                                <ChevronDown
                                    size={14}
                                    className={`text-[var(--text-secondary)] transition-transform duration-150 ${searchExpanded.results ? '' : '-rotate-90'}`}
                                />
                                <span className="text-[11px] font-bold text-[var(--text-secondary)] ml-1 tracking-tight uppercase">
                                    {searchQuery ? `${filteredProjects.length} results in ${filteredProjects.length} files` : 'Search Results'}
                                </span>
                            </div>

                            {searchExpanded.results && (
                                <div className="py-1">
                                    {searchQuery && filteredProjects.map(p => (
                                        <div key={p.id} className="group cursor-default">
                                            <div
                                                onClick={() => onOpenFile({ id: p.id, title: `${p.title}.tsx`, type: 'detail', data: p })}
                                                className="flex items-center gap-1.5 px-4 py-1 hover:bg-[var(--bg-activity)] cursor-pointer"
                                            >
                                                <ChevronDown size={14} className="text-[var(--text-secondary)]" />
                                                {(() => {
                                                    const { icon: Icon, color } = getFileIcon(`${p.title}.tsx`);
                                                    return <Icon size={14} className={color} />;
                                                })()}
                                                <span className="text-[13px] text-[var(--text-primary)] truncate">{p.title}.tsx</span>
                                                <span className="ml-auto text-[10px] bg-[var(--bg-panel)] px-1.5 rounded-full text-[var(--text-secondary)] border border-[var(--border)]">1</span>
                                            </div>

                                            {/* Preview Match */}
                                            <div className="pl-12 pr-4 py-0.5 hover:bg-[var(--bg-activity)] cursor-pointer flex items-center gap-2">
                                                <div className="text-[12px] text-[var(--text-secondary)] font-mono whitespace-nowrap overflow-hidden">
                                                    <span className="opacity-50">12: </span>
                                                    <span>export const </span>
                                                    <span className="bg-[var(--accent)]/30 text-[var(--text-primary)] rounded-sm px-0.5">{p.title}</span>
                                                    <span> = () =&gt; &#123;</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {searchQuery && filteredProjects.length === 0 && (
                                        <div className="text-[13px] text-[var(--text-secondary)] px-8 py-4 italic">No results found with current filters.</div>
                                    )}
                                    {!searchQuery && (
                                        <div className="flex flex-col items-center justify-center pt-12 text-center px-6">
                                            <Search size={32} className="text-[var(--text-secondary)] opacity-10 mb-4" />
                                            <div className="text-[13px] text-[var(--text-secondary)] opacity-50">
                                                Type to search for projects, components, or documents across your workspace.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {/* DEPLOYMENTS VIEW */}
                {activeView === 'deployments' && (
                    <div className="flex-1 flex flex-col min-h-0 min-w-0">
                        <div className="h-9 px-4 flex items-center justify-between text-[11px] font-bold text-[var(--text-secondary)] tracking-wider uppercase">
                            <span>Deployments</span>
                            <div className="flex gap-2">
                                <RefreshCw size={14} className="hover:text-[var(--text-primary)] cursor-pointer" onClick={() => onToast('Refreshing Cloud status...', 'info')} />
                                <Plus size={14} className="hover:text-[var(--text-primary)] cursor-pointer" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {/* ACTIVE SERVICES SECTION */}
                            <div
                                className="h-[22px] flex items-center px-1 bg-[var(--bg-activity)]/30 cursor-pointer border-t border-white/5"
                                onClick={() => setDeploymentsExpanded(prev => ({ ...prev, services: !prev.services }))}
                            >
                                <ChevronDown size={14} className={`text-[var(--text-secondary)] transition-transform duration-150 ${deploymentsExpanded.services ? '' : '-rotate-90'}`} />
                                <span className="text-[11px] font-bold text-[var(--text-secondary)] ml-1 tracking-tight uppercase">Active Services</span>
                            </div>

                            {deploymentsExpanded.services && (
                                <div className="py-1">
                                    {PROJECTS_DATA.slice(0, 4).map(p => (
                                        <div key={p.id} className="group relative px-4 py-2 hover:bg-[var(--bg-activity)] cursor-pointer transition-colors border-l-2 border-transparent hover:border-[var(--accent)]">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <Cloud size={14} className="text-[var(--accent)]" />
                                                    <span className="text-[13px] font-bold text-[var(--text-primary)]">{p.title}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Online
                                                </div>
                                            </div>
                                            <div className="text-[11px] text-[var(--text-secondary)] opacity-60 ml-6 truncate">production-main • us-east-1</div>

                                            <div className="flex items-center gap-2 ml-6 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); window.open((p.links as any).live || p.links.github, '_blank'); }}
                                                    className="px-2 py-0.5 bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-[var(--accent-fg)] text-[10px] rounded-[2px]"
                                                >
                                                    Open App
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeploy(p.title); }}
                                                    className="p-1 hover:bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:text-[var(--accent)] rounded transition-colors"
                                                    title="Re-deploy"
                                                >
                                                    <RotateCcw size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* PERFORMANCE AUDIT SECTION */}
                            <div
                                className="h-[22px] flex items-center px-1 bg-[var(--bg-activity)]/30 cursor-pointer border-t border-white/5"
                                onClick={() => setDeploymentsExpanded(prev => ({ ...prev, infrastructure: !prev.infrastructure }))}
                            >
                                <ChevronDown size={14} className={`text-[var(--text-secondary)] transition-transform duration-150 ${deploymentsExpanded.infrastructure ? '' : '-rotate-90'}`} />
                                <span className="text-[11px] font-bold text-[var(--text-secondary)] ml-1 tracking-tight uppercase">Technical Audit</span>
                            </div>

                            {deploymentsExpanded.infrastructure && (
                                <div className="p-4 space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between group">
                                            <span className="text-[11px] text-[var(--text-secondary)]">Production Health</span>
                                            <span className="text-[11px] font-bold text-emerald-400">99.8%</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[
                                                { label: 'Perf', val: 98, color: 'bg-emerald-500' },
                                                { label: 'Acc', val: 95, color: 'bg-emerald-500' },
                                                { label: 'SEO', val: 100, color: 'bg-blue-500' },
                                                { label: 'Best', val: 92, color: 'bg-emerald-500' }
                                            ].map((score, i) => (
                                                <div key={i} className="flex flex-col items-center gap-1">
                                                    <div className="relative w-8 h-8 rounded-full border-2 border-[var(--border)] flex items-center justify-center">
                                                        <span className="text-[10px] font-bold text-[var(--text-primary)]">{score.val}</span>
                                                    </div>
                                                    <span className="text-[8px] uppercase opacity-50">{score.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-[var(--border)]/30 space-y-2">
                                        <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase opacity-50 mb-1">Production Domains</div>
                                        <div className="space-y-1.5 text-[11px]">
                                            <div className="flex items-center justify-between text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group cursor-pointer">
                                                <span>portfolio.arnav.dev</span>
                                                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100" />
                                            </div>
                                            <div className="flex items-center justify-between text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group cursor-pointer">
                                                <span>mouseshifter.io</span>
                                                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100" />
                                            </div>
                                            <div className="flex items-center justify-between text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group cursor-pointer">
                                                <span>api.netbridge.tech</span>
                                                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded p-2 text-[10px] text-[var(--success)] flex items-center gap-2">
                                        <CheckCircle size={12} />
                                        <span>All systems pass technical audit</span>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}

                {/* CERTIFICATIONS VIEW */}
                {activeView === 'certifications' && (
                    <div className="flex-1 flex flex-col min-h-0 min-w-0">
                        <div className="h-9 px-4 flex items-center justify-between text-[11px] font-bold text-[var(--text-secondary)] tracking-wider uppercase">
                            <span>Certifications</span>
                            <div className="flex gap-2">
                                <RefreshCw size={14} className="hover:text-[var(--text-primary)] cursor-pointer" />
                                <Filter size={14} className="hover:text-[var(--text-primary)] cursor-pointer" />
                            </div>
                        </div>

                        {/* Search Certs */}
                        <div className="px-4 mb-4">
                            <div className="flex items-center gap-2 px-2 py-1 bg-[var(--bg-activity)] border border-[var(--border)] rounded-sm focus-within:border-[var(--accent)] transition-colors">
                                <Search size={12} className="text-[var(--text-secondary)]" />
                                <input
                                    type="text"
                                    placeholder="Search Marketplace"
                                    value={certSearch}
                                    onChange={(e) => setCertSearch(e.target.value)}
                                    className="bg-transparent border-none outline-none text-[11px] text-[var(--text-primary)] w-full font-sans"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {/* SECTION: INSTALLED (CERTIFIED) */}
                            <div className="h-[22px] flex items-center px-1 bg-[var(--bg-activity)]/30 cursor-pointer border-t border-white/5">
                                <ChevronDown size={14} className="text-[var(--text-secondary)]" />
                                <span className="text-[11px] font-bold text-[var(--text-secondary)] ml-1 tracking-tight uppercase">Verified Credentials</span>
                            </div>

                            <div className="py-2 space-y-1">
                                {filteredCerts.map((cert) => (
                                    <div key={cert.id} className="group relative flex gap-3 px-4 py-2 hover:bg-[var(--bg-activity)] cursor-pointer transition-colors border-l-2 border-transparent hover:border-[var(--accent)]">
                                        <div className="w-10 h-10 bg-[var(--bg-activity)] flex items-center justify-center rounded-sm shrink-0 border border-[var(--border)] shadow-sm">
                                            <cert.icon size={20} className="text-[var(--accent)] opacity-80" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div className="text-[13px] font-bold text-[var(--text-primary)] truncate">{cert.name}</div>
                                                <ShieldCheck size={12} className="text-blue-400 mt-0.5 shrink-0" />
                                            </div>
                                            <div className="text-[11px] text-[var(--text-secondary)] truncate">{cert.issuer}</div>
                                            <div className="text-[10px] text-[var(--text-secondary)] line-clamp-1 opacity-60 leading-tight mt-0.5">{cert.description}</div>

                                            <div className="flex items-center gap-3 mt-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleVerifyCert(cert.name); }}
                                                    className="px-2 py-0.5 bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-[var(--accent-fg)] text-[10px] rounded-[2px] font-medium transition-colors"
                                                >
                                                    Verify
                                                </button>
                                                <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] opacity-60">
                                                    <Award size={10} />
                                                    <span>{cert.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {filteredCerts.length === 0 && (
                                    <div className="px-8 py-10 flex flex-col items-center justify-center text-center opacity-40">
                                        <Trophy size={48} className="mb-4" />
                                        <div className="text-xs">No certifications found.</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}


                {/* SETTINGS VIEW */}
                {activeView === 'settings' && (
                    <div className="flex-1 flex flex-col min-h-0 min-w-0">
                        <div className="px-4 py-2 text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase">Settings</div>

                        {/* Search Input */}
                        <div className="px-4 mb-4">
                            <div className="flex items-center gap-2 px-2 py-1 bg-[var(--bg-activity)] border border-[var(--border)] rounded-sm focus-within:border-[var(--accent)] transition-colors">
                                <Search size={12} className="text-[var(--text-secondary)]" />
                                <input
                                    type="text"
                                    placeholder="Search settings"
                                    value={settingsSearch}
                                    onChange={(e) => setSettingsSearch(e.target.value)}
                                    className="bg-transparent border-none outline-none text-[11px] text-[var(--text-primary)] w-full font-sans"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-6 space-y-6">
                            {/* EDITOR CATEGORY */}
                            {("text editor".includes(settingsSearch.toLowerCase()) || "word wrap".includes(settingsSearch.toLowerCase()) || "minimap".includes(settingsSearch.toLowerCase())) && (
                                <div>
                                    <h3 className="text-[10px] font-bold text-[var(--accent)] uppercase mb-3 tracking-tighter">Text Editor</h3>
                                    <div className="space-y-4">
                                        {("word wrap".includes(settingsSearch.toLowerCase())) && (
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <div className="text-xs text-[var(--text-primary)] font-medium">Word Wrap</div>
                                                    <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-tight opacity-70">Controls how lines should wrap.</div>
                                                </div>
                                                <button onClick={() => toggleSetting("Word Wrap")} className="shrink-0">
                                                    {editorSettings.wordWrap
                                                        ? <ToggleRight size={22} className="text-[var(--accent)]" />
                                                        : <ToggleLeft size={22} className="text-[var(--text-secondary)] opacity-50" />}
                                                </button>
                                            </div>
                                        )}

                                        {("minimap".includes(settingsSearch.toLowerCase())) && (
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <div className="text-xs text-[var(--text-primary)] font-medium">Minimap</div>
                                                    <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-tight opacity-70">Shows a high-level overview of the code.</div>
                                                </div>
                                                <button onClick={() => toggleSetting("Minimap")} className="shrink-0">
                                                    {editorSettings.minimap
                                                        ? <ToggleRight size={22} className="text-[var(--accent)]" />
                                                        : <ToggleLeft size={22} className="text-[var(--text-secondary)] opacity-50" />}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* WORKBENCH CATEGORY */}
                            {(
                                "workbench".includes(settingsSearch.toLowerCase()) ||
                                "color theme".includes(settingsSearch.toLowerCase()) ||
                                Object.values(THEMES).some(t => t.name.toLowerCase().includes(settingsSearch.toLowerCase()))
                            ) && (
                                    <div>
                                        <h3 className="text-[10px] font-bold text-[var(--accent)] uppercase mb-3 tracking-tighter">Workbench</h3>
                                        <div className="space-y-4">
                                            <div className="text-xs text-[var(--text-primary)] font-medium mb-1">Color Theme</div>

                                            <div className="space-y-1">
                                                {Object.entries(THEME_CATEGORIES).map(([catTitle, themeKeys]) => {
                                                    const installedInCategory = themeKeys.filter(k => installedThemes.includes(k));
                                                    if (installedInCategory.length === 0) return null;

                                                    return (
                                                        <ThemeCollapsibleGroup
                                                            key={catTitle}
                                                            title={catTitle}
                                                            themes={Object.entries(THEMES).filter(([k]) => installedInCategory.includes(k))}
                                                            activeTheme={theme}
                                                            setTheme={setTheme}
                                                            uninstallTheme={uninstallTheme}
                                                            search={settingsSearch}
                                                        />
                                                    );
                                                })}

                                                {/* AUTHENTIC LINK TO MARKETPLACE */}
                                                {(settingsSearch === '' || "install additional color themes".includes(settingsSearch.toLowerCase())) && (
                                                    <button
                                                        onClick={() => setActiveView('marketplace')}
                                                        className="w-full mt-2 flex items-center gap-2 px-2 py-1.5 text-[11px] text-[var(--accent)] hover:bg-[var(--bg-activity)] transition-all text-left font-medium"
                                                    >
                                                        <span>Install Additional Color Themes...</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* PORTFOLIO CATEGORY */}
                            {("portfolio".includes(settingsSearch.toLowerCase()) || "authentic vscode".includes(settingsSearch.toLowerCase()) || "stylish layout".includes(settingsSearch.toLowerCase())) && (
                                <div>
                                    <h3 className="text-[10px] font-bold text-[var(--accent)] uppercase mb-3 tracking-tighter">Portfolio</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="text-xs text-[var(--text-primary)] font-medium">Authentic VS Code Layout</div>
                                                <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-tight opacity-70">Toggle between high-fidelity VS Code and Stylish home layouts.</div>
                                            </div>
                                            <button onClick={() => setHomepageLayout(homepageLayout === 'modern' ? 'vscode' : 'modern')} className="shrink-0">
                                                {homepageLayout === 'vscode'
                                                    ? <ToggleRight size={22} className="text-[var(--accent)]" />
                                                    : <ToggleLeft size={22} className="text-[var(--text-secondary)] opacity-50" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FOOTER ACTIONS */}
                            {!settingsSearch && (
                                <div className="pt-4 border-t border-[var(--border)] space-y-2">
                                    <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-activity)] transition-all text-left">
                                        <FileJson size={14} />
                                        <span>Open settings.json</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveView('marketplace')}
                                        className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-activity)] transition-all text-left"
                                    >
                                        <Palette size={14} />
                                        <span>Configure Themes</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* MARKETPLACE VIEW */}
                {activeView === 'marketplace' && (
                    <ThemeMarketplace />
                )}

                {/* ACCOUNT VIEW */}
                {activeView === 'account' && (
                    <div className="flex-1 flex flex-col min-h-0 min-w-0">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                            <div className="text-xs font-bold text-[var(--text-secondary)] mb-4 tracking-wider">ACCOUNTS</div>

                            <div className="space-y-1">
                                {/* Main Account Row */}
                                <div className="flex items-center gap-3 p-2 rounded bg-[var(--bg-activity)]/50 border border-[var(--border)] mb-4">
                                    <div className="w-10 h-10 rounded bg-gradient-to-br from-[var(--hero-gradient-start)] to-[var(--hero-gradient-end)] flex items-center justify-center text-sm font-bold text-white shrink-0">
                                        A
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-[var(--text-primary)] truncate">Arnav</div>
                                        <div className="text-[10px] text-[var(--text-secondary)] truncate">arnav@development.env</div>
                                    </div>
                                </div>

                                {/* Settings Sync Item */}
                                <div className="flex items-center justify-between p-2 hover:bg-[var(--bg-activity)] rounded group cursor-pointer border border-transparent hover:border-[var(--border)] transition-all mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Cloud size={16} className="text-[var(--accent)]" />
                                            <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-[var(--success)] rounded-full border border-[var(--bg-main)]"></div>
                                        </div>
                                        <span className="text-xs text-[var(--text-primary)]">Settings Sync is On</span>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-[var(--success)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>

                                <div className="pt-4 border-t border-[var(--border)] space-y-1">
                                    <button
                                        onClick={handleEditProfile}
                                        className="w-full flex items-center gap-3 px-2 py-1.5 rounded text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-activity)] transition-all text-left"
                                    >
                                        <User size={14} />
                                        <span>Manage Portfolio Profile</span>
                                    </button>
                                    <button
                                        className="w-full flex items-center gap-3 px-2 py-1.5 rounded text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-activity)] transition-all text-left"
                                    >
                                        <ShieldCheck size={14} />
                                        <span>Trust Workspace</span>
                                    </button>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 px-2 py-1.5 rounded text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-activity)] text-red-400 hover:text-red-300 transition-all text-left"
                                    >
                                        <LogOut size={14} />
                                        <span>Sign Out of Portfolio</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-[var(--bg-activity)]/20 border border-[var(--border)] rounded-sm">
                                <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-2">Developer Status</h4>
                                <div className="flex items-center gap-2 text-[11px] text-[var(--success)] font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                                    <span>Verified Architect</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
