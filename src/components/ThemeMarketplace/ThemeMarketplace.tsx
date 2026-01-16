import { useContext, useState, useEffect, useMemo, useRef } from 'react';
import { THEMES, THEME_CATEGORIES } from '../../data/themes';
import { ThemeContext } from '../../context/ThemeContext';
import { Search, Check, Trash2, Package, Settings2 } from 'lucide-react';

const WebpagePreview = ({ data }: { data: any }) => {
    const c = data.colors;
    return (
        <div
            className="w-full aspect-video rounded-md border flex flex-col overflow-hidden shadow-sm transition-colors duration-200 relative group/web select-none"
            style={{
                backgroundColor: c['--bg-main'],
                borderColor: c['--border']
            }}
        >
            {/* Main Workbench Area */}
            <div className="flex-1 flex min-h-0">
                {/* Activity Bar (Thin Left) */}
                <div className="w-[10%] h-full flex flex-col items-center py-1 gap-1" style={{ backgroundColor: c['--bg-activity'] }}>
                    <div className="w-1.5 h-1.5 rounded-full opacity-40" style={{ backgroundColor: c['--text-secondary'] }} />
                    <div className="w-1.5 h-1.5 rounded-full opacity-20" style={{ backgroundColor: c['--text-secondary'] }} />
                    <div className="w-1.5 h-1.5 rounded-full opacity-20" style={{ backgroundColor: c['--text-secondary'] }} />
                    <div className="mt-auto mb-1 w-1.5 h-1.5 rounded-full opacity-20" style={{ backgroundColor: c['--text-secondary'] }} />
                </div>

                {/* Sidebar (Left Panel) */}
                <div className="w-[25%] h-full border-r flex flex-col p-1 gap-1.5" style={{ backgroundColor: c['--bg-panel'], borderColor: c['--border'] }}>
                    <div className="w-1/2 h-1 rounded-[1px] opacity-30 uppercase" style={{ backgroundColor: c['--text-secondary'] }} />
                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-[1px] opacity-20" style={{ backgroundColor: c['--text-secondary'] }} />
                            <div className="w-3/4 h-[2px] rounded-full opacity-40" style={{ backgroundColor: c['--text-secondary'] }} />
                        </div>
                        <div className="flex items-center gap-1 ml-1.5">
                            <div className="w-1 h-1 rounded-[1px] opacity-20" style={{ backgroundColor: c['--text-secondary'] }} />
                            <div className="w-2/3 h-[1px] rounded-full opacity-20" style={{ backgroundColor: c['--text-secondary'] }} />
                        </div>
                        <div className="flex items-center gap-1 ml-1.5">
                            <div className="w-1 h-1 rounded-[1px] opacity-20" style={{ backgroundColor: c['--text-secondary'] }} />
                            <div className="w-1/2 h-[1px] rounded-full opacity-20" style={{ backgroundColor: c['--text-secondary'] }} />
                        </div>
                    </div>
                </div>

                {/* Editor Area (Right) */}
                <div className="flex-1 h-full flex flex-col">
                    {/* Tabs Area */}
                    <div className="h-3 flex items-center border-b" style={{ backgroundColor: c['--bg-tabs'], borderColor: c['--border'] }}>
                        <div className="h-full px-2 flex items-center gap-1 border-r" style={{ backgroundColor: c['--bg-main'], borderColor: c['--border'] }}>
                            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: c['--accent'] }} />
                            <div className="w-8 h-[2px] rounded-full opacity-40" style={{ backgroundColor: c['--text-primary'] }} />
                        </div>
                        <div className="h-full px-2 flex items-center gap-1 opacity-30">
                            <div className="w-6 h-[1px] rounded-full shrink-0" style={{ backgroundColor: c['--text-secondary'] }} />
                        </div>
                    </div>

                    {/* Code Content */}
                    <div className="flex-1 p-2 space-y-1">
                        <div className="flex gap-1">
                            <div className="w-8 h-1 rounded-[1px]" style={{ backgroundColor: c['--accent'] }} />
                            <div className="w-12 h-1 rounded-[1px] opacity-20" style={{ backgroundColor: c['--text-secondary'] }} />
                            <div className="w-6 h-1 rounded-[1px] text-blue-400 opacity-60" style={{ backgroundColor: c['--accent'] }} />
                        </div>
                        <div className="flex gap-1 ml-4">
                            <div className="w-16 h-[2px] rounded-[1px]" style={{ backgroundColor: c['--accent'] }} />
                        </div>
                        <div className="flex gap-1 ml-4">
                            <div className="w-10 h-[2px] rounded-[1px] opacity-40" style={{ backgroundColor: c['--text-secondary'] }} />
                            <div className="w-6 h-[2px] rounded-[1px]" style={{ backgroundColor: c['--accent'] }} />
                        </div>
                        <div className="flex gap-1 mt-2">
                            <div className="w-4 h-1 rounded-[1px] opacity-60" style={{ backgroundColor: c['--accent'] }} />
                            <div className="w-14 h-1 rounded-[1px] opacity-20" style={{ backgroundColor: c['--text-secondary'] }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Bar (Bottom) */}
            <div className="h-2 w-full flex items-center px-1.5 justify-between" style={{ backgroundColor: c['--bg-status'] }}>
                <div className="flex gap-1 items-center">
                    <div className="w-1.5 h-[2px] rounded-[0.5px]" style={{ backgroundColor: c['--fg-status'] || '#ffffff' }} />
                    <div className="w-3 h-[1px] rounded-[0.5px] opacity-40" style={{ backgroundColor: c['--fg-status'] || '#ffffff' }} />
                </div>
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full opacity-30" style={{ backgroundColor: c['--fg-status'] || '#ffffff' }} />
                </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/web:opacity-100 transition-opacity pointer-events-none" />
        </div>
    );
};

const ThemeMarketplaceItem = ({
    themeKey,
    data,
    isInstalled,
    activeTheme,
    onInstall,
    onUninstall,
    onSet,
    isBuiltIn = false
}: {
    themeKey: string,
    data: any,
    isInstalled: boolean,
    activeTheme: string,
    onInstall: (k: string) => void,
    onUninstall: (k: string) => void,
    onSet: (k: string) => void,
    isBuiltIn?: boolean
}) => {
    const isApplied = activeTheme === themeKey;
    const [isInstalling, setIsInstalling] = useState(false);

    const handleInstall = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsInstalling(true);
        // Randomized download duration for authenticity (800ms to 2400ms)
        const randomTime = Math.floor(Math.random() * 1600) + 800;
        setTimeout(() => {
            onInstall(themeKey);
            setIsInstalling(false);
        }, randomTime);
    };

    return (
        <div
            className={`group flex flex-col px-4 py-5 hover:bg-[var(--bg-activity)]/30 cursor-pointer border-b border-[var(--border)]/30 transition-all ${isApplied ? 'bg-[var(--accent)]/[0.03]' : ''}`}
            onClick={() => isInstalled && !isInstalling && onSet(themeKey)}
        >
            <div className="flex flex-col gap-4">
                <WebpagePreview data={data} />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[13px] font-semibold text-[var(--text-primary)] truncate transition-colors group-hover:text-[var(--accent)]">
                                    {data.name}
                                </span>
                                {isInstalled && !isInstalling && <Check size={12} className="text-[var(--accent)]" />}
                            </div>
                            <div className="text-[11px] text-[var(--text-secondary)] truncate opacity-60 flex items-center gap-2 mt-0.5 uppercase tracking-wider font-medium">
                                {themeKey.includes('Light') || data.name.includes('Light') ? 'Light Theme' : 'Dark Theme'}
                                {isBuiltIn && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)] opacity-30" />
                                        <span className="text-[var(--accent)] font-bold text-[9px]">Built-in</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Row */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {!isInstalled ? (
                                <button
                                    disabled={isInstalling}
                                    onClick={handleInstall}
                                    className="bg-[var(--accent)] text-[var(--accent-fg)] px-5 py-1 rounded-sm text-[12px] font-medium hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm tracking-tight min-w-[84px] justify-center relative overflow-hidden"
                                >
                                    {isInstalling ? (
                                        <>
                                            <span className="opacity-80">Installing</span>
                                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/40 animate-vscode-loader" />
                                        </>
                                    ) : 'Install'}
                                </button>
                            ) : (
                                <button
                                    disabled={isApplied || isInstalling}
                                    onClick={(e) => { e.stopPropagation(); onSet(themeKey) }}
                                    className={`px-4 py-1 rounded-sm text-[12px] font-medium transition-all tracking-tight ${isApplied
                                        ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 cursor-default'
                                        : 'bg-[var(--bg-activity)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--border)]'
                                        }`}
                                >
                                    {isApplied ? 'Selected' : 'Set Color Theme'}
                                </button>
                            )}
                        </div>

                        {/* Uninstall only shown for non-built-in themes that are installed */}
                        {isInstalled && !isBuiltIn && !isInstalling && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onUninstall(themeKey); }}
                                className="text-[var(--text-secondary)] hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                title="Uninstall"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ThemeMarketplace = () => {
    const { theme: activeTheme, setTheme, installedThemes, installTheme, uninstallTheme } = useContext(ThemeContext);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Infinite Scroll State for flat list
    const [displayLimit, setDisplayLimit] = useState(30);
    const observerTarget = useRef(null);

    // Initial load simulation
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Search/Filter simulation
    useEffect(() => {
        setIsLoading(true);
        setDisplayLimit(30); // Reset limit on search
        const randomTime = Math.floor(Math.random() * 200) + 150;
        const timer = setTimeout(() => setIsLoading(false), randomTime);
        return () => clearTimeout(timer);
    }, [search, selectedCategory]);

    const handleCategoryClick = (cat: string | null) => {
        setSelectedCategory(cat === selectedCategory ? null : cat);
    };

    // DERIVE THEMES
    const allThemesEntry = useMemo(() => Object.entries(THEMES), []);

    const filteredThemes = useMemo(() => {
        let items = allThemesEntry;

        // 1. Category Filter
        if (selectedCategory) {
            if (selectedCategory === 'Other') {
                const categoriedKeys = new Set(Object.values(THEME_CATEGORIES).flat());
                items = items.filter(([k]) => !categoriedKeys.has(k));
            } else {
                const keys = (THEME_CATEGORIES as any)[selectedCategory] || [];
                items = items.filter(([k]) => keys.includes(k));
            }
        }

        // 2. Smart Search Filter (Names, Keys, and Semantic Colors)
        if (search) {
            const s = search.toLowerCase();

            // Color mapping for semantic search
            const colorMap: Record<string, string[]> = {
                'blue': ['#007acc', '#0078D4', '#58a6ff', '#88c0d0', '#6699cc', '#add7ff', '#3d8eff', '#0ea5e9'],
                'red': ['#f43f5e', '#ff0000', '#e06c75', '#ff5555', '#cc241d', '#d14d41', '#fb4934'],
                'green': ['#4ec9b0', '#3fb950', '#50fa7b', '#a3be8c', '#bfff00', '#4ade80', '#22c55e', '#879a39'],
                'orange': ['#d29922', '#ffb86c', '#fe8019', '#f59e0b', '#fb923c', '#e2a478', '#ce9178'],
                'purple': ['#bd93f9', '#8a2be2', '#bc00ff', '#be95ff', '#c678dd', '#af87ff', '#8b5cf6'],
                'pink': ['#ff79c6', '#ff7edb', '#ee5396', '#f43f5e', '#f472b6'],
                'gold': ['#fabd2f', '#fac863', '#d0a215', '#f1c21b', '#ebcb8b', '#cca700'],
                'yellow': ['#fabd2f', '#fac863', '#f1c21b', '#ffff00', '#facc15'],
            };

            items = items.filter(([k, d]: any) => {
                const nameMatch = (d?.name?.toLowerCase() || '').includes(s);
                const keyMatch = k.toLowerCase().includes(s);

                // Check if search is a color name
                const isColorQuery = Object.keys(colorMap).some(color => color.includes(s) || s.includes(color));
                let colorMatch = false;

                if (isColorQuery) {
                    const accent = d?.colors?.['--accent']?.toLowerCase() || '';
                    // Check if the theme's accent color starts with or contains any of the target hexes
                    colorMatch = Object.entries(colorMap).some(([colorName, hexes]) => {
                        if (s.includes(colorName) || colorName.includes(s)) {
                            return hexes.some(h => accent.includes(h.toLowerCase()));
                        }
                        return false;
                    });
                }

                // Vibe search
                const isVibeQuery = ['dark', 'light', 'neon', 'minimal', 'amoled', 'soft'].some(v => s.includes(v));
                let vibeMatch = false;
                if (isVibeQuery) {
                    if (s.includes('dark')) vibeMatch = k.toLowerCase().includes('dark') || d?.name?.toLowerCase().includes('dark');
                    if (s.includes('light')) vibeMatch = k.toLowerCase().includes('light') || d?.name?.toLowerCase().includes('light');
                    if (s.includes('neon')) vibeMatch = ['synthwave', 'cyberpunk', 'neon', 'matrix', 'laserwave'].some(v => k.toLowerCase().includes(v));
                    if (s.includes('amoled') || s.includes('black')) vibeMatch = d?.colors?.['--bg-main'] === '#000000' || d?.colors?.['--bg-main'] === '#050505';
                }

                return nameMatch || keyMatch || colorMatch || vibeMatch;
            });
        }

        return items;
    }, [allThemesEntry, selectedCategory, search]);

    const visibleThemes = filteredThemes.slice(0, displayLimit);
    const hasMore = displayLimit < filteredThemes.length;

    // INFINITE SCROLL OBSERVER for flat list
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && hasMore) {
                    setIsLoading(true);

                    // Randomized fetch simulation (400ms to 1200ms)
                    const randomTime = Math.floor(Math.random() * 800) + 400;

                    setTimeout(() => {
                        setDisplayLimit(prev => prev + 20);
                        setIsLoading(false);
                    }, randomTime);
                }
            },
            { threshold: 0.1, rootMargin: '200px' }
        );

        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [isLoading, hasMore]);

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-panel)] select-none relative">
            {/* HEADER AREA - VS CODE AUTHENTIC MARGINS */}
            <div className="flex flex-col bg-[var(--bg-panel)] border-b border-[var(--border)]/10 relative">
                {/* AUTHENTIC VS CODE LOADING PROGRESS BAR */}
                {isLoading && (
                    <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] z-50 overflow-hidden bg-transparent">
                        <div className="h-full bg-[var(--accent)] animate-vscode-loader" />
                    </div>
                )}

                {/* Search Bar Row */}
                <div className="px-4 pt-4 pb-2">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search Themes in Marketplace"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[var(--bg-activity)] border border-[var(--border)] rounded py-[4px] pl-3 pr-10 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 focus:outline-none focus:border-[var(--accent)] transition-all shadow-sm"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                            {search && (
                                <button onClick={() => setSearch('')} className="p-1 hover:bg-[var(--border)] rounded opacity-60 hover:opacity-100">
                                    <div className="text-[14px]">×</div>
                                </button>
                            )}
                            <Search size={14} className="text-[var(--text-secondary)] opacity-40" />
                        </div>
                    </div>
                </div>

                {/* FILTER TOOLBAR - AUTHENTIC VS CODE SECONDARY NAV */}
                <div className="relative flex flex-col px-4 pb-3 gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest opacity-60 flex items-center gap-1.5">
                            <Settings2 size={10} />
                            Marketplace Categories
                        </span>
                        {selectedCategory && (
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="text-[9px] text-[var(--accent)] font-bold uppercase tracking-tighter hover:underline"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="relative group/nav overflow-hidden">
                        <div
                            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing py-1"
                            onWheel={(e) => {
                                if (e.deltaY !== 0) e.currentTarget.scrollLeft += e.deltaY;
                            }}
                        >
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-2.5 py-0.5 rounded-sm text-[11px] border transition-all shrink-0 ${!selectedCategory ? 'bg-[var(--accent)] text-[var(--accent-fg)] border-[var(--accent)]' : 'bg-[var(--bg-activity)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--border)]'}`}
                            >
                                All Themes
                            </button>
                            {Object.keys(THEME_CATEGORIES).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryClick(cat)}
                                    className={`px-2.5 py-0.5 rounded-sm text-[11px] border transition-all shrink-0 ${selectedCategory === cat ? 'bg-[var(--accent)] text-[var(--accent-fg)] border-[var(--accent)]' : 'bg-[var(--bg-activity)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--border)]'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RESULTS COUNTER / BREADCRUMB */}
            <div className="px-4 py-1.5 bg-[var(--bg-activity)]/20 border-b border-[var(--border)]/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)] font-medium">
                    <span className="opacity-60">{selectedCategory || 'All Marketplace'}</span>
                    {search && (
                        <>
                            <span className="opacity-30">/</span>
                            <span className="text-[var(--accent)]">{search}</span>
                        </>
                    )}
                </div>
            </div>

            {/* FLAT RESULTS LIST */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col">
                    {visibleThemes.map(([k, data]) => (
                        <ThemeMarketplaceItem
                            key={k}
                            themeKey={k}
                            data={data}
                            isInstalled={installedThemes.includes(k)}
                            activeTheme={activeTheme}
                            onInstall={installTheme}
                            onUninstall={uninstallTheme}
                            onSet={setTheme}
                            isBuiltIn={selectedCategory === 'Core Favorites' || ['darkModern', 'vscode', 'githubDark', 'nord', 'oneDarkPro', 'dracula'].includes(k)}
                        />
                    ))}

                    {/* Infinite Scroll Load State */}
                    {hasMore && (
                        <div
                            ref={observerTarget}
                            className="h-20 flex flex-col items-center justify-center opacity-20"
                        >
                            <div className="w-8 h-[1px] bg-[var(--text-secondary)] animate-pulse" />
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredThemes.length === 0 && (
                        <div className="p-12 flex flex-col items-center justify-center text-center opacity-40">
                            <Package size={48} strokeWidth={1} className="text-[var(--text-secondary)] mb-4" />
                            <div className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">No matching themes</div>
                            <div className="text-[10px] text-[var(--text-secondary)] mt-1">Try refining your search or filter.</div>
                        </div>
                    )}
                </div>

                {/* Visual spacer */}
                <div className="h-20" />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes vscode-loader {
                    0% { transform: translateX(-100%) scaleX(0.1); }
                    50% { transform: translateX(0%) scaleX(0.5); }
                    100% { transform: translateX(100%) scaleX(0.1); }
                }
                .animate-vscode-loader {
                    width: 100%;
                    transform-origin: left;
                    animation: vscode-loader 1s infinite linear;
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};
