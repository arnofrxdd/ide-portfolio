import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    Search as SearchIcon, Terminal, FileCode, Lock, GitBranch, Box, FileText,
    FileJson, Palette, ToggleLeft, ToggleRight
} from 'lucide-react';
import { PROJECTS_DATA } from '../../data/projects';
import { THEMES } from '../../data/themes';
import { FILE_CONTENTS } from '../../data/fileSystem';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenFile: (file: any) => void;
}

export const CommandPalette = ({ isOpen, onClose, onOpenFile }: CommandPaletteProps) => {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
    // ADD THIS BLOCK
    useEffect(() => {
        if (itemRefs.current[selectedIndex]) {
            itemRefs.current[selectedIndex]?.scrollIntoView({
                behavior: 'smooth', // or 'auto' for instant
                block: 'nearest',
            });
        }
    }, [selectedIndex]);
    // Generate a flat list of all openable items
    const allItems = useMemo(() => {
        const items: any[] = [];
        items.push({
            id: 'open_terminal',
            title: 'Open Terminal',
            type: 'command',
            icon: Terminal,
            action: 'open_terminal'
        });

        // Pages
        items.push({ id: 'home', title: 'home.tsx', type: 'home', icon: FileCode, path: 'src/pages/home.tsx' });
        items.push({ id: 'projects_tsx', title: 'projects.tsx', type: 'projects', icon: FileCode, path: 'src/pages/projects.tsx' });

        // Projects
        PROJECTS_DATA.forEach(p => {
            items.push({ id: p.id, title: `${p.title}.tsx`, type: 'detail', data: p, icon: FileCode, path: `src/projects/${p.title}.tsx` });
        });
        Object.entries(THEMES).forEach(([key, theme]) => {
            items.push({
                id: `theme_${key}`,
                title: `Theme: ${theme.name}`,
                type: 'command',
                action: 'set_theme',
                themeKey: key,
                icon: Palette,
                path: 'Preferences / Theme'
            });
        });
        // --- INSERT THIS BLOCK ---
        items.push({
            id: 'toggle_minimap',
            title: 'View: Toggle Minimap',
            type: 'command',
            action: 'toggle_setting',
            settingKey: 'minimap',
            icon: ToggleLeft,
            path: 'Preferences'
        });
        items.push({
            id: 'toggle_wordwrap',
            title: 'View: Toggle Word Wrap',
            type: 'command',
            action: 'toggle_setting',
            settingKey: 'wordWrap',
            icon: FileText,
            path: 'Preferences'
        });
        // Config files
        items.push({ id: 'env', title: '.env', type: 'code', content: FILE_CONTENTS.env, lang: 'bash', icon: Lock, path: '.env' });
        items.push({ id: 'gitignore', title: '.gitignore', type: 'code', content: FILE_CONTENTS.gitignore, lang: 'bash', icon: GitBranch, path: '.gitignore' });
        items.push({ id: 'package', title: 'package.json', type: 'package', icon: Box, path: 'package.json' });
        items.push({ id: 'readme', title: 'README.md', type: 'readme', icon: FileText, path: 'README.md' });
        items.push({ id: 'projects_json', title: 'projects.json', type: 'code', content: FILE_CONTENTS.projects_json, lang: 'json', icon: FileJson, path: 'src/projects.json' });
        items.push({
            id: 'word_wrap_from_hell',
            title: 'word_wrap_from_hell.json',
            type: 'code',
            content: FILE_CONTENTS.word_wrap_from_hell,
            lang: 'json',
            icon: FileJson,
            path: 'word_wrap_from_hell.json'
        });
        items.push({
            id: "minimap_stress_test",
            title: "minimap_stress_test.json",
            type: "code",
            content: FILE_CONTENTS.minimap_stress_test,
            lang: "json",
            icon: FileJson,
            path: "minimap_stress_test.json"
        }
        );

        // Components
        items.push({ id: 'terminal_comp', title: 'Terminal.tsx', type: 'code', content: FILE_CONTENTS.terminal_component, lang: 'typescript', icon: FileCode, path: 'src/components/Terminal.tsx' });
        items.push({ id: 'window_comp', title: 'Window.tsx', type: 'code', content: FILE_CONTENTS.window_component, lang: 'typescript', icon: FileCode, path: 'src/components/Window.tsx' });

        // Recruiter
        items.push({ id: 'hire_me', title: 'hire_me.json', type: 'code', content: FILE_CONTENTS.hire_me, lang: 'json', icon: FileJson, path: 'recruiter/hire_me.json' });
        items.push({ id: 'skills', title: 'skills.json', type: 'code', content: FILE_CONTENTS.skills_json, lang: 'json', icon: FileJson, path: 'recruiter/skills.json' });

        return items;
    }, []);

    const filteredItems = useMemo(() => {
        if (!query) return allItems;
        const lowerQ = query.toLowerCase();
        return allItems.filter(item =>
            item.title.toLowerCase().includes(lowerQ) ||
            item.path?.toLowerCase().includes(lowerQ)
        );
    }, [query, allItems]);


    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery("");
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredItems.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const item = filteredItems[selectedIndex];
            if (!item) return;

            if (item.type === 'command') {
                if (item.action === 'open_terminal') {
                    window.dispatchEvent(new CustomEvent('open-terminal'));
                    onClose();
                    return;
                }

                if (item.action === 'set_theme') {
                    window.dispatchEvent(
                        new CustomEvent('set-theme', { detail: item.themeKey })
                    );
                    onClose();
                    return;
                }
                if (item.action === 'toggle_setting') {
                    window.dispatchEvent(
                        new CustomEvent('toggle-setting', { detail: item.settingKey })
                    );
                    onClose();
                    return;
                }
            }


            onOpenFile(item);
            onClose();
        }
        else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex justify-center pt-[10vh]" onClick={onClose}>
            <div
                className="w-[600px] max-w-[90vw] bg-[var(--bg-panel)] border border-[var(--border)] shadow-2xl rounded-lg overflow-hidden flex flex-col h-[400px]"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-3 border-b border-[var(--border)] flex items-center gap-3">
                    <SearchIcon size={16} className="text-[var(--text-secondary)]" />
                    <input
                        ref={inputRef}
                        className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] text-sm font-mono placeholder-[var(--text-secondary)]"
                        placeholder="Search files by name..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="text-[10px] bg-[var(--bg-activity)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded border border-[var(--border)]">ESC</div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                    {filteredItems.length === 0 && (
                        <div className="text-center text-[var(--text-secondary)] text-xs mt-4">No matching results</div>
                    )}
                    {filteredItems.map((item, idx) => (
                        <div
                            key={idx}
                            ref={el => { itemRefs.current[idx] = el; }}
                            onClick={() => {
                                if (item.type === 'command') {
                                    if (item.action === 'open_terminal') {
                                        window.dispatchEvent(new CustomEvent('open-terminal'));
                                        onClose();
                                        return;
                                    }

                                    if (item.action === 'set_theme') {
                                        window.dispatchEvent(
                                            new CustomEvent('set-theme', { detail: item.themeKey })
                                        );
                                        onClose();
                                        return;
                                    }
                                    if (item.action === 'toggle_setting') {
                                        window.dispatchEvent(
                                            new CustomEvent('toggle-setting', { detail: item.settingKey })
                                        );
                                        onClose();
                                        return;
                                    }
                                }


                                onOpenFile(item);
                                onClose();
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer group ${idx === selectedIndex ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-primary)] hover:bg-[var(--bg-activity)]'}`}
                        >
                            <item.icon size={14} className={idx === selectedIndex ? 'text-white' : 'text-[var(--text-secondary)]'} />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-mono truncate">{item.title}</div>
                                <div className={`text-[10px] truncate ${idx === selectedIndex ? 'text-white/70' : 'text-[var(--text-secondary)]'}`}>{item.path}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-1 bg-[var(--bg-main)] border-t border-[var(--border)] text-[10px] text-[var(--text-secondary)] text-right px-3">
                    Portfolio Command Palette
                </div>
            </div>
        </div>
    );
};
