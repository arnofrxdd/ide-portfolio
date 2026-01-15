import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    Zap, ExternalLink, Terminal, GitBranch, Folder, Filter, Trash2,
    Activity, FileText, Server, Code, HardDrive, Github, Globe, Eye, Edit3, FileCode
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { PROJECTS_DATA } from '../../data/projects';
import { THEMES } from '../../data/themes';
// @ts-ignore
import FONT_5x7 from '../../data/font5x7';
import { Breadcrumbs } from '../UI/Breadcrumbs';
import { RealMinimap } from './Minimap';
import { CanvasContributionMap } from '../Widgets/ContributionMap';
import { TypingEffect } from '../UI/TypingEffect';
import { TechTag } from '../UI/TechTag';

interface ContentRendererProps {
    type: string;
    data?: any;
    title?: string;
    onOpenFile: (file: any) => void;
    content?: string;
    lang?: string;
    editorSettings: any;
}

export const ContentRenderer = ({ type, data, title, onOpenFile, content, lang, editorSettings }: ContentRendererProps) => {
    const { theme } = useContext(ThemeContext);
    const editorScrollRef = useRef<HTMLDivElement>(null);

    // Logic to get breadcrumb path
    const getPath = () => {
        if (type === 'home') return 'src/pages/home.tsx';
        if (type === 'projects') return 'src/pages/projects.tsx';

        if (type === 'detail' && data)
            return `src/projects/${data.title}.tsx`;

        if (type === 'code') {
            // recruiter files
            if (title?.startsWith('recruiter/'))
                return title;

            // pages-level json
            if (title === 'projects.json')
                return 'src/pages/projects.json';

            // root config files
            if (title?.startsWith('.'))
                return title;

            // components
            if (title?.endsWith('.tsx'))
                return `src/components/${title}`;

            return title || 'Unknown';
        }

        if (type === 'readme') return 'README.md';

        return '';
    };

    const path = getPath();

    if (type === 'code') {
        const cleanContent = content ? content.trim() : "";
        const lines = cleanContent ? cleanContent.split('\n') : [];

        return (
            <div className="h-full flex flex-col bg-[var(--bg-main)]">
                <Breadcrumbs path={path} />

                <div className="flex-1 overflow-hidden flex relative">

                    {/* Main Scrollable Editor Area */}
                    <div
                        ref={editorScrollRef}
                        className="flex-1 overflow-auto custom-scrollbar flex flex-col"
                    >
                        <div className="min-w-fit min-h-full py-4">
                            {lines.map((line, i) => (
                                <div key={i} className="flex flex-row hover:bg-[var(--bg-activity)]/30 w-full">

                                    {/* Line Number */}
                                    <div className="w-12 shrink-0 text-right pr-4 text-[var(--line-number)] font-mono text-sm select-none opacity-40 leading-[1.5]">
                                        {i + 1}
                                    </div>

                                    {/* Code Content */}
                                    <div
                                        className={`
                      flex-1 pl-2 font-mono text-sm text-[var(--text-primary)] leading-[1.5] min-w-0 pr-4
                      ${editorSettings.wordWrap
                                                ? "whitespace-pre-wrap break-words break-all"
                                                : "whitespace-pre"
                                            }
                    `}
                                    >
                                        {line || " "}
                                    </div>
                                </div>
                            ))}

                            {lines.length === 0 && (
                                <div className="pl-14 text-[var(--text-secondary)] italic text-xs">No content.</div>
                            )}
                        </div>
                    </div>

                    {/* REAL MINIMAP */}
                    {editorSettings.minimap && (
                        <RealMinimap
                            content={cleanContent}
                            editorRef={editorScrollRef}
                        />
                    )}
                </div>
            </div>
        );
    }

    if (type === 'home') {
        const featuredProjects = PROJECTS_DATA.filter(p => p.featured);
        const recentActivity = [
            { action: "Optimizing", target: "frontend performance", time: "ongoing" },
            { action: "Designing", target: "scalable systems", time: "active" },
            { action: "Refining", target: "developer experience", time: "constant" },
            { action: "Building", target: "production-ready tools", time: "always" },
        ];

        return (
            <div className="h-full flex flex-col">
                <Breadcrumbs path={path} />
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-4 md:p-12 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-20">

                        {/* HERO SECTION */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                            <div>
                                <span className="text-[var(--text-secondary)] font-mono text-sm block mb-2">// Initializing Portfolio System...</span>
                                <h1 className="text-3xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
                                    <span className="mr-3">Hello, I'm</span>
                                    {/* DYNAMIC THEME GRADIENT */}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--hero-gradient-start)] to-[var(--hero-gradient-end)]">
                                        <TypingEffect text="Arnav" speed={150} />
                                    </span>
                                    <span className="ml-1 text-[var(--accent)] animate-[blink_1s_steps(1)_infinite]">_</span>
                                </h1>
                            </div>
                        </div>

                        {/* STATUS GRID - DYNAMIC COLORS */}
                        <div className="pl-4 md:pl-6 border-l-2 border-[var(--border)] space-y-4 font-mono text-xs md:text-base mb-12">

                            {/* 1. Current Role */}
                            <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                                <span className="text-[var(--warning)] min-w-[80px] md:min-w-[100px]">current_role:</span>
                                <span className="text-[var(--text-primary)]">"Full Stack Engineer"</span>
                            </div>

                            {/* 2. Location */}
                            <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                                <span className="text-[var(--success)] min-w-[80px] md:min-w-[100px]">location:</span>
                                <span className="text-[var(--text-primary)]">"Remote"</span>
                            </div>

                            {/* 3. Status */}
                            <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                                <span className="text-[var(--info)] min-w-[80px] md:min-w-[100px]">status:</span>
                                <span className="text-[var(--text-primary)]">"Building cool things"</span>
                            </div>

                        </div>

                        {/* PINNED PROJECTS */}
                        <div className="mb-8">
                            <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2 font-mono">
                                <Zap size={18} className="text-[var(--warning)]" /> Pinned Deployments
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredProjects.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() =>
                                            onOpenFile({
                                                id: p.id,
                                                title: `${p.title}.tsx`,
                                                type: 'detail',
                                                data: p
                                            })
                                        }
                                        className="bg-[var(--bg-panel)] border border-[var(--border)] hover:border-[var(--accent)] rounded-lg p-5 cursor-pointer hover:-translate-y-1 transition-all group shadow-lg"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <FileCode size={16} className="text-[var(--accent)]" />
                                                <span className="text-[var(--text-primary)] font-mono text-sm font-semibold truncate max-w-[150px]">
                                                    {p.title}
                                                </span>
                                            </div>
                                            <ExternalLink size={12} className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                                        </div>
                                        <p className="text-[var(--text-secondary)] text-xs line-clamp-2 mb-4 h-8">
                                            {p.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ACTION BUTTON */}
                        <div className="mb-12 flex flex-wrap gap-4">
                            <button
                                onClick={() =>
                                    onOpenFile({
                                        id: 'projects_tsx',
                                        title: 'projects.tsx',
                                        type: 'projects'
                                    })
                                }
                                className="group flex items-center gap-3 px-6 py-3 bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-secondary)] font-mono text-sm rounded-md hover:bg-[var(--bg-panel)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                            >
                                <Terminal size={16} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
                                <span className="tracking-wide">./view_all_projects</span>
                            </button>
                        </div>

                        {/* CONTRIBUTION MAP - THEME AWARE */}
                        <CanvasContributionMap theme={theme} />
                        {/* RECENT ACTIVITY */}
                        <div className="mb-12">
                            <h2 className="text-sm font-bold text-[var(--text-secondary)] mb-4 flex items-center gap-2 font-mono uppercase tracking-wider">
                                <GitBranch size={14} className="text-[var(--info)]" /> Recent Activity
                            </h2>
                            <div className="space-y-2">
                                {recentActivity.map((act, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm bg-[var(--bg-activity)]/20 border border-[var(--border)]/50 p-3 rounded hover:border-[var(--accent)] hover:bg-[var(--bg-activity)] transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--info)]" />
                                            <span className="text-[var(--text-secondary)] font-mono">{act.action} <span className="text-[var(--text-primary)] font-bold group-hover:text-[var(--accent)] cursor-pointer decoration-dotted underline-offset-4">{act.target}</span></span>
                                        </div>
                                        <span className="text-xs text-[var(--text-secondary)] font-mono opacity-70">{act.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    if (type === 'projects') {
        const [showFilters, setShowFilters] = useState(false);
        const [techFilters, setTechFilters] = useState<string[]>([]);
        const [langFilters, setLangFilters] = useState<string[]>([]);

        const allTech = Array.from(new Set(PROJECTS_DATA.flatMap(p => p.tech || []))).sort();
        const allLanguages = Array.from(new Set(PROJECTS_DATA.flatMap(p => (p.languages || []).map(l => l.name)))).sort();

        const filteredProjects = PROJECTS_DATA.filter(p => {
            const techMatch = techFilters.length === 0 || p.tech?.some(t => techFilters.includes(t));
            const langMatch = langFilters.length === 0 || p.languages?.some(l => langFilters.includes(l.name));
            return techMatch && langMatch;
        });

        const toggleFilter = (value: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) => {
            setFn(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
        };

        return (
            <div className="h-full flex flex-col">
                <Breadcrumbs path={path} />
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-4 md:p-12 max-w-7xl mx-auto pb-24">
                        <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-4">
                            <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <Folder size={20} className="text-[var(--accent)]" /> /projects
                            </h2>
                            <button
                                onClick={() => setShowFilters(v => !v)}
                                className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-2 transition-colors"
                            >
                                <Filter size={14} /> {showFilters ? "hide_filters" : "show_filters"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-8">
                            {showFilters && (
                                <div className="space-y-6">
                                    {/* TECH STACK FILTERS */}
                                    <div className="bg-[var(--bg-activity)] border border-[var(--border)] rounded-lg p-4">
                                        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3 font-mono">Tech Stack</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {allTech.map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => toggleFilter(t, setTechFilters)}
                                                    className={`px-2 py-1 text-[10px] font-mono rounded border transition-all 
                          ${techFilters.includes(t)
                                                            ? "bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)]"
                                                            : "bg-[var(--bg-main)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]"}`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* LANGUAGE FILTERS */}
                                    <div className="bg-[var(--bg-activity)] border border-[var(--border)] rounded-lg p-4">
                                        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3 font-mono">Languages</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {allLanguages.map(l => (
                                                <button
                                                    key={l}
                                                    onClick={() => toggleFilter(l, setLangFilters)}
                                                    className={`px-2 py-1 text-[10px] font-mono rounded border transition-all 
                          ${langFilters.includes(l)
                                                            ? "bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)]"
                                                            : "bg-[var(--bg-main)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]"}`}
                                                >
                                                    {l}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {(techFilters.length > 0 || langFilters.length > 0) && (
                                        <button
                                            onClick={() => { setTechFilters([]); setLangFilters([]); }}
                                            className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--warning)] flex items-center gap-2"
                                        >
                                            <Trash2 size={12} /> clear_all_filters
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProjects.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => onOpenFile({ id: p.id, title: `${p.title}.tsx`, type: "detail", data: p })}
                                        className="group bg-[var(--bg-panel)] border border-[var(--border)] hover:border-[var(--accent)] rounded-lg overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <div className="h-32 bg-[var(--bg-activity)] relative overflow-hidden">
                                            <img
                                                src={p.image}
                                                alt={p.title}
                                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-[var(--text-primary)] font-bold mb-1 group-hover:text-[var(--accent)] truncate transition-colors">{p.title}</h3>
                                            <p className="text-[var(--text-secondary)] text-xs line-clamp-2 mb-3">{p.description}</p>
                                            <div className="flex flex-wrap gap-2">{p.tech?.slice(0, 3).map(t => <TechTag key={t} label={t} />)}</div>
                                        </div>
                                    </div>
                                ))}
                                {filteredProjects.length === 0 && (
                                    <div className="col-span-full text-center text-[var(--text-secondary)] font-mono text-sm mt-12">No projects match selected filters.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'detail' && data) {
        return (
            <div className="h-full flex flex-col">
                <Breadcrumbs path={path} />
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-4 md:p-12 max-w-6xl mx-auto pb-32">
                        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8 min-w-0">

                            {/* LEFT COLUMN */}
                            <div className="space-y-8 min-w-0">
                                <div>
                                    <div className="flex items-center gap-3 text-xs md:text-sm font-mono text-[var(--text-secondary)] mb-2">
                                        <span className="flex items-center gap-1"><GitBranch size={12} /> main</span>
                                        <span className="text-[var(--border)]">|</span>
                                        <span className="flex items-center gap-1"><Activity size={12} /> {data.deployHistory?.[0]?.version || 'v1.0.0'}</span>
                                    </div>
                                    <h1 className="text-2xl md:text-5xl font-bold text-[var(--text-primary)] mb-2 tracking-tight break-words">{data.title}</h1>
                                    <p className="text-base md:text-xl text-[var(--text-secondary)] font-light border-l-2 border-[var(--accent)] pl-4 break-words">{data.subtitle}</p>
                                </div>

                                {/* DESCRIPTION (README) - VS CODE AUTHENTIC FONT */}
                                <div className="bg-[var(--bg-activity)]/30 border border-[var(--border)] rounded-lg p-4 md:p-6">
                                    <div className="flex items-center gap-2 mb-0.001 text-[var(--text-primary)] font-mono text-sm border-b border-[var(--border)] pb-2">
                                        <FileText size={14} className="text-[var(--info)]" /> README.md
                                    </div>
                                    <p className="text-[var(--text-primary)] text-base font-sans leading-relaxed opacity-90 whitespace-pre-wrap">{data.longDescription}</p>
                                </div>

                                {/* PROJECT IMAGE MOVED HERE */}
                                <div className="rounded-lg border border-[var(--border)] shadow-2xl relative group p-4 flex justify-center items-center bg-black/20 overflow-hidden h-[300px] sm:h-auto">
                                    <img src={data.image} alt={data.title} className="max-w-full max-h-full object-contain sm:w-auto sm:h-auto sm:object-cover" />
                                </div>

                                {/* ARCHITECTURE */}
                                {data.architecture && (
                                    <div className="bg-[var(--bg-activity)] border border-[var(--border)] rounded-lg p-4 md:p-6 overflow-hidden">
                                        <div className="flex items-center gap-2 mb-4 text-[var(--text-primary)] font-mono text-sm">
                                            <Server size={14} className="text-[var(--warning)]" /> System Architecture
                                        </div>
                                        <div className="overflow-x-auto w-full custom-scrollbar">
                                            <pre className="font-mono text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed min-w-max">{data.architecture}</pre>
                                        </div>
                                    </div>
                                )}

                                {/* CODE SNIPPET */}
                                {data.snippet && (
                                    <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-lg overflow-hidden min-w-0">
                                        <div className="bg-[var(--bg-activity)] px-4 py-2 border-b border-[var(--border)] flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]"><Code size={12} /> core_logic.ts</div>
                                            <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                                            </div>
                                        </div>
                                        <div className="p-4 overflow-x-auto w-full custom-scrollbar">
                                            <pre className="font-mono text-xs md:text-sm text-[var(--success)] leading-relaxed min-w-max">{data.snippet}</pre>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="space-y-6 min-w-0">
                                {/* IMAGE MOVED TO LEFT COLUMN */}

                                {/* LANGUAGES */}
                                <div className="bg-[var(--bg-activity)]/30 border border-[var(--border)] rounded-lg p-5">
                                    <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4 font-mono flex items-center gap-2">Languages</h3>
                                    <div className="flex h-3 rounded-full overflow-hidden mb-3">
                                        {data.languages.map((lang: any, index: number) => (
                                            <div key={index} style={{ width: `${lang.percent}%`, backgroundColor: lang.color }} className="h-full" />
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {data.languages.map((lang: any, index: number) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                                                <span className="text-xs text-[var(--text-primary)] font-mono">{lang.name} <span className="text-[var(--text-secondary)]">{lang.percent}%</span></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* DEPLOY LOG */}
                                <div className="bg-[var(--bg-activity)]/30 border border-[var(--border)] rounded-lg p-5">
                                    <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4 font-mono flex items-center gap-2"><HardDrive size={12} /> Deploy Log</h3>
                                    <div className="space-y-3">
                                        {data.deployHistory ? data.deployHistory.map((deploy: any, idx: number) => (
                                            <div key={idx} className={`flex gap-2 ${idx !== 0 ? 'opacity-60 hover:opacity-100 transition-opacity' : ''}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${deploy.status === 'success' ? 'bg-[var(--success)]' : 'bg-red-500'}`} />
                                                <div>
                                                    <div className="text-xs text-[var(--text-primary)] font-mono">{deploy.version} - {deploy.msg}</div>
                                                    <div className="text-[10px] text-[var(--text-secondary)]">{deploy.time}</div>
                                                </div>
                                            </div>
                                        )) : <div className="text-xs text-[var(--text-secondary)] italic">No deployment history found.</div>}
                                    </div>
                                </div>

                                {/* TECH STACK */}
                                <div className="bg-[var(--bg-activity)]/30 border border-[var(--border)] rounded-lg p-6">
                                    <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4 font-mono">Tech Stack</h3>
                                    <div className="flex flex-wrap gap-2">{data.tech.map((t: string) => <TechTag key={t} label={t} />)}</div>
                                </div>

                                {/* LINKS */}
                                {data.links && (data.links.github || data.links.live) && (
                                    <div className="flex flex-col gap-3">
                                        {typeof data.links.github === "string" && data.links.github.trim() !== "" && (
                                            <a href={data.links.github} target="_blank" rel="noopener noreferrer" className="py-3 bg-[var(--bg-activity)] border border-[var(--border)] hover:border-[var(--text-primary)] text-[var(--text-primary)] rounded flex items-center justify-center gap-2 transition-all font-mono text-sm">
                                                <Github size={16} /> git checkout
                                            </a>
                                        )}
                                        {typeof data.links.live === "string" && data.links.live.trim() !== "" && (
                                            <a href={data.links.live} target="_blank" rel="noopener noreferrer" className="py-3 bg-[var(--accent)]/10 border border-[var(--accent)]/50 text-[var(--accent)] hover:bg-[var(--accent)]/20 rounded flex items-center justify-center gap-2 transition-all font-mono text-sm">
                                                <Globe size={16} /> view_deployment
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'readme') {
        const [isPreview, setIsPreview] = useState(true);
        return (
            <div className="h-full flex flex-col">
                <Breadcrumbs path={path} />
                <div className="p-4 md:p-12 max-w-4xl mx-auto w-full h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
                        <div className="flex items-center gap-2 text-[var(--text-primary)] font-mono font-bold text-xl">
                            <FileText size={20} className="text-[var(--info)]" />
                            <span>README.md</span>
                        </div>
                        <div className="flex bg-[var(--bg-activity)] rounded-lg p-1 border border-[var(--border)]">
                            <button onClick={() => setIsPreview(true)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${isPreview ? 'bg-[var(--bg-main)] text-[var(--accent)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                                <Eye size={14} /> Preview
                            </button>
                            <button onClick={() => setIsPreview(false)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${!isPreview ? 'bg-[var(--bg-main)] text-[var(--accent)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                                <Edit3 size={14} /> Source
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {isPreview ? (
                            <div className="prose prose-invert prose-slate max-w-none font-sans text-[var(--text-primary)]">
                                <h1 className="flex items-center gap-3 text-3xl font-bold mb-4"><span className="text-4xl">⚙️</span><span>Hi, I’m Arnav</span></h1>
                                <p className="lead text-lg text-[var(--text-secondary)] mb-6">Developer focused on building performant interfaces, low-level tooling, and systems that actually ship.</p>
                                <hr className="border-[var(--border)] my-8" />
                                <h3 className="text-[var(--success)] text-xl font-bold mb-4">🧠 What I Work On</h3>
                                <p className="mb-6 text-[var(--text-primary)] leading-relaxed">I build full-stack applications with React and Node.js, desktop tools in C++ and Python, and infrastructure-level solutions involving networking, automation, and system internals.</p>
                                <h3 className="text-[var(--accent)] text-xl font-bold mb-4">🛠 Core Stack</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none pl-0 mb-8">
                                    <li className="flex items-center gap-2 bg-[var(--bg-activity)]/50 p-2 rounded border border-[var(--border)]"><span className="text-cyan-400">⚛️</span> React / Vite / Tailwind</li>
                                    <li className="flex items-center gap-2 bg-[var(--bg-activity)]/50 p-2 rounded border border-[var(--border)]"><span className="text-green-500">🟢</span> Node.js / Express</li>
                                    <li className="flex items-center gap-2 bg-[var(--bg-activity)]/50 p-2 rounded border border-[var(--border)]"><span className="text-blue-400">🔷</span> TypeScript / JavaScript</li>
                                    <li className="flex items-center gap-2 bg-[var(--bg-activity)]/50 p-2 rounded border border-[var(--border)]"><span className="text-orange-400">🧠</span> C++ / Win32 / System APIs</li>
                                    <li className="flex items-center gap-2 bg-[var(--bg-activity)]/50 p-2 rounded border border-[var(--border)]"><span className="text-yellow-400">🐍</span> Python / Automation</li>
                                    <li className="flex items-center gap-2 bg-[var(--bg-activity)]/50 p-2 rounded border border-[var(--border)]"><span className="text-sky-400">🌐</span> Networking / Proxies / Tunnels</li>
                                </ul>
                            </div>
                        ) : (
                            <div className="flex">
                                <div className="w-8 border-r border-[var(--border)] text-right pr-2 text-[var(--line-number)] select-none">1<br />2<br />3</div>
                                <div className="pl-2 font-mono text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                                    {`# ⚙️ Hi, I’m Arnav\n\nDeveloper focused on building performant interfaces...`}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    return null;
};
