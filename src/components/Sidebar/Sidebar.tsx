import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    FileCode, Search, GitBranch, Box, User, Settings,
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
    setEditorSettings
}: SidebarProps) => {

    const { theme, setTheme } = useContext(ThemeContext);
    const [activeView, setActiveView] = useState('explorer');
    const [isPanelVisible, setIsPanelVisible] = useState(true);
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
        'src': true,
        'components': false,
        'pages': true,
        'projects': false,
        'recruiter': true
    });
    const [isExplorerMenuOpen, setIsExplorerMenuOpen] = useState(false);
    const explorerMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (explorerMenuRef.current && !explorerMenuRef.current.contains(e.target as Node)) {
                setIsExplorerMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    const handleActivityClick = (view: string) => {
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

    const filteredProjects = PROJECTS_DATA.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full border-r border-[var(--border)] bg-[var(--bg-activity)] z-30 relative shrink-0 transition-colors duration-300">

            {/* ACTIVITY BAR */}
            <div className="w-12 flex flex-col items-center py-4 border-r border-[var(--border)] bg-[var(--bg-activity)] gap-6 z-30 relative transition-colors duration-300">
                <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'explorer' && isPanelVisible ? 'text-[var(--accent)] border-l-2 border-[var(--accent)] bg-[var(--bg-panel)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} onClick={() => handleActivityClick('explorer')} title="Explorer"><FileCode size={20} /></div>
                <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'search' && isPanelVisible ? 'text-[var(--accent)] border-l-2 border-[var(--accent)] bg-[var(--bg-panel)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} onClick={() => handleActivityClick('search')} title="Search"><Search size={20} /></div>
                <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'git' && isPanelVisible ? 'text-[var(--accent)] border-l-2 border-[var(--accent)] bg-[var(--bg-panel)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} onClick={() => handleActivityClick('git')} title="Source Control"><GitBranch size={20} /></div>
                <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'extensions' && isPanelVisible ? 'text-[var(--accent)] border-l-2 border-[var(--accent)] bg-[var(--bg-panel)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} onClick={() => handleActivityClick('extensions')} title="Extensions"><Box size={20} /></div>
                <div className="mt-auto flex flex-col gap-6">
                    <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'account' && isPanelVisible ? 'text-[var(--accent)] border-l-2 border-[var(--accent)] bg-[var(--bg-panel)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} onClick={() => handleActivityClick('account')} title="Account"><User size={20} /></div>
                    <div className={`p-2 rounded-lg cursor-pointer transition-all ${activeView === 'settings' && isPanelVisible ? 'text-[var(--accent)] border-l-2 border-[var(--accent)] bg-[var(--bg-panel)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} onClick={() => handleActivityClick('settings')} title="Settings"><Settings size={20} /></div>
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
            <div className={`
        flex flex-col bg-[var(--bg-main)] border-r border-[var(--border)]
        fixed md:relative top-0 bottom-0 left-12 md:left-0 z-20
        w-60 transition-transform duration-300 ease-in-out
        ${isPanelVisible ? 'translate-x-0' : '-translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden md:border-none'}
      `}>

                {/* EXPLORER VIEW */}
                {activeView === 'explorer' && (
                    <div className="flex-1 flex flex-col min-h-0 min-w-[15rem]">
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

                        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                            {/* OPEN EDITORS */}
                            <div className="mb-2">
                                <div className="px-4 text-xs font-bold text-[var(--text-secondary)] mb-1">
                                    OPEN EDITORS
                                </div>
                                {tabs.map(tab => {
                                    const { icon, color } = getFileIcon(tab.title);
                                    return (
                                        <FileTreeItem
                                            key={tab.id}
                                            depth={0}
                                            name={tab.title}
                                            icon={icon}
                                            color={color}
                                            isActive={tab.id === activeTabId}
                                            onClick={() => setActiveTabId(tab.id)}
                                            showClose={tab.id !== 'home'}
                                            onClose={() => {
                                                if (tab.id === 'home') return;
                                                setActiveTabId(prev => prev === tab.id ? 'home' : prev);
                                                setTabs(prev => prev.filter(t => t.id !== tab.id));
                                            }}
                                        />
                                    );
                                })}
                            </div>

                            {/* DYNAMIC HEADER COLOR */}
                            <div className="px-4 mb-2 flex items-center gap-1 text-[var(--accent)] font-bold text-xs"><ChevronDown size={12} /> <span>PORTFOLIO</span></div>

                            {/* SRC Folder */}
                            <FileTreeItem
                                depth={0} name="src" icon={expandedFolders['src'] ? FolderOpen : Folder} color="text-[var(--accent)]"
                                hasChildren isOpen={expandedFolders['src']} onToggle={() => toggleFolder('src')}
                            />

                            {expandedFolders['src'] && (
                                <>
                                    {/* Projects Folder - uses Success Color */}
                                    <FileTreeItem
                                        depth={1} name="projects" icon={expandedFolders['projects'] ? FolderOpen : Folder} color="text-[var(--success)]"
                                        hasChildren isOpen={expandedFolders['projects']} onToggle={() => toggleFolder('projects')}
                                    />
                                    {expandedFolders['projects'] && PROJECTS_DATA.map(p => {
                                        const fileName = `${p.title}.tsx`;
                                        const fileMeta = getFileIcon(fileName);
                                        return (
                                            <FileTreeItem
                                                key={p.id}
                                                depth={2}
                                                name={fileName}
                                                icon={fileMeta.icon}
                                                color={fileMeta.color}
                                                draggableId={p.id}
                                                onDragStart={(e, id) => {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: {
                                                                id,
                                                                file: { id: p.id, title: fileName, type: 'detail', data: p }
                                                            }
                                                        })
                                                    );
                                                }}
                                                onClick={() => onOpenFile({
                                                    id: p.id,
                                                    title: fileName,
                                                    type: 'detail',
                                                    data: p
                                                })}
                                            />
                                        );
                                    })}

                                    {/* Pages Folder - uses Warning Color */}
                                    <FileTreeItem
                                        depth={1} name="pages" icon={expandedFolders['pages'] ? FolderOpen : Folder} color="text-[var(--warning)]"
                                        hasChildren isOpen={expandedFolders['pages']} onToggle={() => toggleFolder('pages')}
                                    />
                                    {expandedFolders['pages'] && (
                                        <>
                                            {[
                                                { name: "home.tsx", type: "home" },
                                                { name: "projects.tsx", type: "projects" },
                                            ].map(f => {
                                                const meta = getFileIcon(f.name);
                                                return (
                                                    <FileTreeItem
                                                        key={f.name}
                                                        depth={2}
                                                        name={f.name}
                                                        icon={meta.icon}
                                                        color={meta.color}
                                                        draggableId={f.name}
                                                        onDragStart={(e, id) => {
                                                            window.dispatchEvent(
                                                                new CustomEvent("explorer-drag-start", {
                                                                    detail: { id, file: { id: f.name, title: f.name, type: f.type } }
                                                                })
                                                            );
                                                        }}
                                                        onClick={() => onOpenFile({ id: f.name, title: f.name, type: f.type })}
                                                    />
                                                )
                                            })}
                                            {/* Projects JSON */}
                                            <FileTreeItem
                                                depth={2}
                                                name="projects.json"
                                                icon={getFileIcon("projects.json").icon}
                                                color={getFileIcon("projects.json").color}
                                                draggableId="projects_json"
                                                onDragStart={(e, id) => {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: { id, file: { id: "projects_json", title: "projects.json", type: "code", content: FILE_CONTENTS.projects_json, lang: "json" } }
                                                        })
                                                    );
                                                }}
                                                onClick={() =>
                                                    onOpenFile({
                                                        id: "projects_json",
                                                        title: "projects.json",
                                                        type: "code",
                                                        content: FILE_CONTENTS.projects_json,
                                                        lang: "json"
                                                    })
                                                }
                                            />
                                        </>
                                    )}

                                    {/* Components Folder - uses Info Color */}
                                    <FileTreeItem
                                        depth={1} name="components" icon={expandedFolders['components'] ? FolderOpen : Folder} color="text-[var(--success)]"
                                        hasChildren isOpen={expandedFolders['components']} onToggle={() => toggleFolder('components')}
                                    />
                                    {expandedFolders['components'] && (
                                        <>
                                            <FileTreeItem
                                                depth={2}
                                                name="Terminal.tsx"
                                                icon={getFileIcon("Terminal.tsx").icon}
                                                color={getFileIcon("Terminal.tsx").color}
                                                draggableId="terminal_comp"
                                                onDragStart={(e, id) => {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: { id, file: { id: "terminal_comp", title: "Terminal.tsx", type: "code", content: FILE_CONTENTS.terminal_component, lang: "typescript" } }
                                                        })
                                                    );
                                                }}
                                                onClick={() =>
                                                    onOpenFile({
                                                        id: "terminal_comp",
                                                        title: "Terminal.tsx",
                                                        type: "code",
                                                        content: FILE_CONTENTS.terminal_component,
                                                        lang: "typescript"
                                                    })
                                                }
                                            />

                                            <FileTreeItem
                                                depth={2}
                                                name="Window.tsx"
                                                icon={getFileIcon("Window.tsx").icon}
                                                color={getFileIcon("Window.tsx").color}
                                                draggableId="window_comp"
                                                onDragStart={(e, id) => {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: { id, file: { id: "window_comp", title: "Window.tsx", type: "code", content: FILE_CONTENTS.window_component, lang: "typescript" } }
                                                        })
                                                    );
                                                }}
                                                onClick={() =>
                                                    onOpenFile({
                                                        id: "window_comp",
                                                        title: "Window.tsx",
                                                        type: "code",
                                                        content: FILE_CONTENTS.window_component,
                                                        lang: "typescript"
                                                    })
                                                }
                                            />

                                            <FileTreeItem
                                                depth={2}
                                                name="word_wrap_from_hell.json"
                                                icon={getFileIcon("word_wrap_from_hell.json").icon}
                                                color={getFileIcon("word_wrap_from_hell.json").color}
                                                draggableId="word_wrap_from_hell"
                                                onDragStart={(e, id) => {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: { id, file: { id, title: "components/word_wrap_from_hell.json", type: "code", content: FILE_CONTENTS.word_wrap_from_hell, lang: "json" } }
                                                        })
                                                    );
                                                }}
                                                onClick={() =>
                                                    onOpenFile({
                                                        id: "word_wrap_from_hell",
                                                        title: "components/word_wrap_from_hell.json",
                                                        type: "code",
                                                        content: FILE_CONTENTS.word_wrap_from_hell,
                                                        lang: "json"
                                                    })
                                                }
                                            />

                                            <FileTreeItem
                                                depth={2}
                                                name="minimap_stress_test.json"
                                                icon={getFileIcon("minimap_stress_test.json").icon}
                                                color={getFileIcon("minimap_stress_test.json").color}
                                                draggableId="minimap_stress_test"
                                                onDragStart={(e, id) => {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: { id, file: { id: "minimap_stress_test", title: "components/minimap_stress_test.json", type: "code", content: FILE_CONTENTS.minimap_stress_test, lang: "json" } }
                                                        })
                                                    );
                                                }}
                                                onClick={() =>
                                                    onOpenFile({
                                                        id: "minimap_stress_test",
                                                        title: "components/minimap_stress_test.json",
                                                        type: "code",
                                                        content: FILE_CONTENTS.minimap_stress_test,
                                                        lang: "json"
                                                    })
                                                }
                                            />
                                        </>
                                    )}
                                </>
                            )}

                            {/* Root Files */}
                            {[
                                { name: ".env", type: 'code', content: FILE_CONTENTS.env, lang: 'bash' },
                                { name: ".gitignore", type: 'code', content: FILE_CONTENTS.gitignore, lang: 'bash' },
                                { name: "package.json", type: "code", content: FILE_CONTENTS.package_json, lang: "json" },
                                { name: "README.md", type: 'readme', content: FILE_CONTENTS.readme }
                            ].map(f => {
                                const fileMeta = getFileIcon(f.name);
                                return (
                                    <FileTreeItem
                                        key={f.name}
                                        depth={0}
                                        name={f.name}
                                        icon={fileMeta.icon}
                                        color={fileMeta.color}
                                        draggableId={f.name}
                                        onDragStart={(e, id) => {
                                            window.dispatchEvent(
                                                new CustomEvent("explorer-drag-start", {
                                                    detail: { id, file: { id: f.name, title: f.name, type: f.type, content: f.content, lang: f.lang } }
                                                })
                                            );
                                        }}
                                        onClick={() =>
                                            onOpenFile({
                                                id: f.name,
                                                title: f.name,
                                                type: f.type,
                                                content: f.content,
                                                lang: f.lang
                                            })
                                        }
                                    />
                                );
                            })}

                            {/* Recruiter Folder - uses Info Color */}
                            <FileTreeItem
                                depth={0}
                                name="recruiter"
                                icon={expandedFolders['recruiter'] ? FolderOpen : Folder}
                                color="text-[var(--info)]"
                                hasChildren
                                isOpen={expandedFolders['recruiter']}
                                onToggle={() => toggleFolder('recruiter')}
                            />
                            {expandedFolders['recruiter'] && (
                                <>
                                    {[
                                        { name: "hire_me.json", content: FILE_CONTENTS.hire_me, lang: 'json' },
                                        { name: "skills.json", content: FILE_CONTENTS.skills_json, lang: 'json' },
                                        { name: "career_path.txt", content: FILE_CONTENTS.career_path, lang: 'text' }
                                    ].map(f => {
                                        const fileMeta = getFileIcon(f.name);
                                        return (
                                            <FileTreeItem
                                                key={f.name}
                                                depth={1}
                                                name={f.name}
                                                icon={fileMeta.icon}
                                                color={fileMeta.color}
                                                draggableId={`recruiter_${f.name}`}
                                                onDragStart={(e, id) => {
                                                    window.dispatchEvent(
                                                        new CustomEvent("explorer-drag-start", {
                                                            detail: { id, file: { id: `recruiter_${f.name}`, title: `recruiter/${f.name}`, type: "code", content: f.content, lang: f.lang } }
                                                        })
                                                    );
                                                }}
                                                onClick={() =>
                                                    onOpenFile({
                                                        id: `recruiter_${f.name}`,
                                                        title: `recruiter/${f.name}`,
                                                        type: "code",
                                                        content: f.content,
                                                        lang: f.lang
                                                    })
                                                }
                                            />
                                        );
                                    })}
                                </>
                            )}

                        </div>
                    </div>
                )}

                {/* SEARCH VIEW */}
                {activeView === 'search' && (
                    <div className="flex-1 flex flex-col p-4 min-w-[15rem]">
                        <div className="text-xs font-bold text-[var(--text-secondary)] mb-4 tracking-wider">SEARCH</div>
                        <div className="relative mb-4">
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search projects..."
                                className="w-full bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-xs p-2 pl-8 rounded focus:outline-none focus:border-[var(--accent)]"
                            />
                            <Search size={12} className="absolute left-2.5 top-2.5 text-slate-500" />
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {searchQuery && filteredProjects.map(p => (
                                <div key={p.id} onClick={() => onOpenFile({ id: p.id, title: `${p.title}.tsx`, type: 'detail', data: p })} className="group cursor-pointer mb-3 hover:bg-[var(--bg-activity)] p-2 rounded">
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
                    <div className="flex-1 flex flex-col p-4 min-w-[15rem]">
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
                            <input placeholder="Message (Ctrl+Enter)" className="w-full bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-xs p-2 rounded focus:outline-none focus:border-[var(--accent)]" />
                            <button
                                onClick={handleCommit}
                                className="w-full mt-2 bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-white text-xs py-1.5 rounded flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={12} /> Commit
                            </button>
                        </div>
                    </div>
                )}

                {/* EXTENSIONS VIEW */}
                {activeView === 'extensions' && (
                    <div className="flex-1 flex flex-col p-4 min-w-[15rem]">
                        <div className="text-xs font-bold text-[var(--text-secondary)] mb-4 tracking-wider">EXTENSIONS</div>
                        <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
                            {Object.entries(installedExtensions).map(([name, installed], i) => (
                                <div key={i} className="flex gap-3 hover:bg-[var(--bg-activity)] p-2 rounded cursor-default group">
                                    <div className="w-8 h-8 bg-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center rounded shrink-0">
                                        <Box size={16} />
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
                    <div className="flex-1 flex flex-col p-4 min-w-[15rem]">
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
                                        className={`flex items-center gap-3 px-3 py-2 rounded border transition-all text-xs font-mono
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
                            <button onClick={handleEditProfile} className="w-full py-1.5 text-xs bg-[var(--bg-activity)] hover:bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border)] rounded">Edit Profile</button>
                            <button onClick={handleSignOut} className="w-full py-1.5 text-xs bg-[var(--bg-activity)] hover:bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border)] rounded">Sign Out</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
