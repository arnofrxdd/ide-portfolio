import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    Zap, ExternalLink, Terminal, GitBranch, Filter, LayoutGrid, List,
    FileText, Github, Globe, Eye, Edit3, FileCode, Linkedin, Code2, ArrowLeft
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { PROJECTS_DATA } from '../../data/projects';
// @ts-ignore
import FONT_5x7 from '../../data/font5x7';
import { Breadcrumbs } from '../UI/Breadcrumbs';
import { RealMinimap } from './Minimap';
import { CanvasContributionMap } from '../Widgets/ContributionMap';
import { TypingEffect } from '../UI/TypingEffect';

interface ContentRendererProps {
    type: string;
    data?: any;
    title?: string;
    onOpenFile: (file: any) => void;
    content?: string;
    lang?: string;
    editorSettings: any;
    isNavBarVisible?: boolean;
    onScroll?: (e: React.UIEvent<HTMLElement>) => void;
}

export const ContentRenderer = ({ type, data, title, onOpenFile, content, editorSettings, isNavBarVisible = true, onScroll }: ContentRendererProps) => {
    const { theme, homepageLayout, easyMode } = useContext(ThemeContext);
    const editorScrollRef = useRef<HTMLDivElement>(null);

    const [activeTab, setActiveTab] = useState('details');
    const [isPreview, setIsPreview] = useState(true);

    // Logic to get breadcrumb path
    const getPath = () => {
        if (easyMode) {
            if (type === 'home') return 'Home';
            if (type === 'projects') return 'Projects';
            if (type === 'detail' && data) return data.title;
            if (type === 'readme') return 'Readme';
            if (type === 'pdf') return 'Resume';
            return title || '';
        }

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
        if (type === 'pdf') return 'RESUME.PDF';

        return '';
    };

    const path = getPath();

    if (type === 'code') {
        const cleanContent = content ? content.trim() : "";
        const lines = cleanContent ? cleanContent.split('\n') : [];

        return (
            <div className={`h-full flex flex-col bg-[var(--bg-main)] overflow-hidden relative`}>
                {!easyMode && (
                    <div className={`absolute md:relative top-9 md:top-0 left-0 w-full z-30 transition-all duration-300 ease-in-out md:translate-y-0 ${!isNavBarVisible ? '-translate-y-[71px] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                        <Breadcrumbs path={path} />
                    </div>
                )}
                <div className="flex-1 flex flex-row overflow-hidden relative pt-[71px] md:pt-0">
                    <div
                        ref={editorScrollRef}
                        onScroll={onScroll}
                        className="flex-1 overflow-auto custom-scrollbar flex flex-col"
                    >
                        <div className="min-w-fit min-h-full py-4">
                            {lines.map((line, i) => (
                                <div key={i} className="flex flex-row hover:bg-[var(--bg-activity)]/30 w-full">

                                    {/* Line Number (Hidden in Easy Mode) */}
                                    {!easyMode && (
                                        <div className="w-12 shrink-0 text-right pr-4 text-[var(--line-number)] font-mono text-sm select-none opacity-40 leading-[1.5]">
                                            {i + 1}
                                        </div>
                                    )}

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
                            editorRef={editorScrollRef as React.RefObject<HTMLDivElement>}
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

        if (easyMode) {
            return (
                <div className="h-full flex flex-col bg-[var(--bg-main)]">
                    <div className="flex-1 overflow-y-auto custom-scrollbar" onScroll={onScroll}>
                        <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 md:py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

                            <div className="mb-12 px-6 md:px-0">
                                <div className="max-w-4xl">
                                    <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] tracking-tight mb-6 leading-[1.1] md:leading-[1.05]">
                                        Hello, I'm <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--hero-gradient-start)] to-[var(--hero-gradient-end)]">
                                            <TypingEffect text="Arnav" speed={150} />
                                        </span>
                                        <span className="text-[var(--accent)] animate-[blink_1s_steps(1)_infinite]">_</span>
                                    </h1>
                                    <p className="text-base md:text-xl text-[var(--text-secondary)] leading-relaxed mb-10 opacity-90 font-sans max-w-lg">
                                        A Full-Stack Engineer crafting high-performance digital experiences and developer-centric engineering solutions.
                                    </p>

                                    {/* STATUS GRID - INTEGRATED */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-[var(--border)]">
                                        {[
                                            { label: "Current Role", value: "Full Stack Engineer", color: "text-[var(--warning)]" },
                                            { label: "Location", value: "Remote", color: "text-[var(--success)]" },
                                            { label: "Status", value: "Building cool things", color: "text-[var(--info)]" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex flex-col gap-1">
                                                <span className={`font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-wider ${item.color}`}>
                                                    {item.label}
                                                </span>
                                                <span className="text-[var(--text-primary)] font-sans text-xs md:text-sm font-medium">
                                                    {item.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            {/* PINNED PROJECTS - AMAZING IMAGE GRID */}
                            <div className="mb-12">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-10 gap-4">
                                    <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                                        <Zap size={22} className="text-[var(--warning)]" />
                                        Pinned Deployments
                                    </h2>
                                    <button
                                        onClick={() => onOpenFile({ id: 'projects_tsx', title: 'projects.tsx', type: 'projects' })}
                                        className="text-[var(--accent)] hover:text-[var(--accent)]/80 text-sm font-bold flex items-center gap-2 group transition-all self-start md:self-auto"
                                    >
                                        Explore Projects
                                        <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={16} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {featuredProjects.slice(0, 3).map((p, i) => (
                                        <div
                                            key={p.id}
                                            onClick={() => onOpenFile({ id: p.id, title: `${p.title}.tsx`, type: 'detail', data: p })}
                                            className="group relative bg-[var(--bg-panel)] border border-[var(--border)] rounded-sm overflow-hidden cursor-pointer hover:border-[var(--accent)] hover:shadow-2xl hover:shadow-[var(--accent)]/5 transition-all flex flex-col animate-in fade-in slide-in-from-bottom-4"
                                            style={{ animationDelay: `${i * 100}ms` }}
                                        >
                                            <div className="aspect-[16/10] relative overflow-hidden bg-[var(--bg-activity)]">
                                                <img
                                                    src={p.image}
                                                    alt={p.title}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute top-4 left-4 flex gap-1">
                                                    {p.languages?.slice(0, 2).map((lang: any) => (
                                                        <span key={lang.name} className="px-2 py-0.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-sm text-[9px] font-bold text-white uppercase tracking-wider">
                                                            {lang.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">{p.title}</h3>
                                                    <ExternalLink size={14} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
                                                </div>
                                                <p className="text-sm text-[var(--text-secondary)] opacity-80 line-clamp-2 leading-relaxed h-10 font-sans">
                                                    {p.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CONTRIBUTION MAP SECTION */}
                            <div className="mb-12 relative group">
                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Code Contributions</h2>
                                            <p className="text-sm text-[var(--text-secondary)] opacity-70">Consistent activity throughout the year across various engineering domains.</p>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden">
                                        <CanvasContributionMap theme={theme} />
                                    </div>
                                </div>
                            </div>

                            {/* RECENT ACTIVITY - FULL WIDTH */}
                            <div className="w-full">
                                <h2 className="text-sm font-bold text-[var(--text-secondary)] mb-6 flex items-center gap-2 font-sans uppercase tracking-[0.2em] opacity-60">
                                    <GitBranch size={14} className="text-[var(--info)]" />
                                    Recent Activity
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {recentActivity.map((act, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between text-sm bg-[var(--bg-panel)] border border-[var(--border)] p-4 rounded-sm hover:border-[var(--accent)] hover:bg-[var(--bg-activity)]/40 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--info)] shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]" />
                                                <span className="text-[var(--text-secondary)] font-sans">
                                                    {act.action} <span className="text-[var(--text-primary)] font-bold group-hover:text-[var(--accent)] transition-colors">{act.target}</span>
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-[var(--text-secondary)] font-mono opacity-50">{act.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            );
        }

        if (homepageLayout === 'vscode') {
            return (
                <div className="h-full flex flex-col bg-[var(--bg-main)]">
                    <Breadcrumbs path={path} />
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="p-8 md:p-12 max-w-5xl mx-auto animate-in fade-in duration-500">
                            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h1 className="text-4xl text-[var(--text-primary)] font-light mb-2">Arnav's Portfolio</h1>
                                    <p className="text-lg text-[var(--text-secondary)] opacity-70">Full Stack Engineer & System Architect</p>
                                </div>
                                <div className="flex gap-4">
                                    <a href="https://github.com/arnofrxdd" target="_blank" rel="noopener noreferrer" className="p-2 bg-[var(--bg-activity)] hover:bg-[var(--accent)]/20 border border-[var(--border)] rounded-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all">
                                        <Github size={20} />
                                    </a>
                                    <a href="https://www.linkedin.com/in/arnav-dalai-557214252/" target="_blank" rel="noopener noreferrer" className="p-2 bg-[var(--bg-activity)] hover:bg-[var(--accent)]/20 border border-[var(--border)] rounded-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all" title="LinkedIn">
                                        <Linkedin size={20} />
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* LEFT COLUMN: START */}
                                <div>
                                    <h2 className="text-sm font-bold text-[var(--text-primary)] mb-4 tracking-wider uppercase opacity-80">Start</h2>
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => onOpenFile({ id: 'projects_tsx', title: 'projects.tsx', type: 'projects' })}
                                            className="w-full flex items-center gap-3 text-[var(--accent)] hover:underline text-sm group"
                                        >
                                            <LayoutGrid size={18} className="group-hover:scale-110 transition-transform" />
                                            <span>Explore All Projects</span>
                                        </button>
                                        <button
                                            onClick={() => onOpenFile({ id: 'README.md', title: 'README.md', type: 'readme', content: '' })}
                                            className="w-full flex items-center gap-3 text-[var(--accent)] hover:underline text-sm group"
                                        >
                                            <FileText size={18} className="group-hover:scale-110 transition-transform" />
                                            <span>Read Portfolio Overview</span>
                                        </button>
                                        <button
                                            onClick={() => window.dispatchEvent(new CustomEvent('open-terminal'))}
                                            className="w-full flex items-center gap-3 text-[var(--accent)] hover:underline text-sm group"
                                        >
                                            <Terminal size={18} className="group-hover:scale-110 transition-transform" />
                                            <span>Open Integrated Terminal</span>
                                        </button>
                                    </div>

                                    <h2 className="text-sm font-bold text-[var(--text-primary)] mt-12 mb-4 tracking-wider uppercase opacity-80">Recent Projects</h2>
                                    <div className="space-y-1">
                                        {PROJECTS_DATA.slice(0, 5).map(p => (
                                            <div
                                                key={p.id}
                                                onClick={() => onOpenFile({ id: p.id, title: `${p.title}.tsx`, type: 'detail', data: p })}
                                                className="group flex items-center justify-between p-2 rounded hover:bg-[var(--bg-activity)] cursor-pointer transition-all"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <FileCode size={16} className="text-[var(--accent)] shrink-0" />
                                                    <span className="text-sm text-[var(--text-primary)] truncate font-sans">{p.title}</span>
                                                </div>
                                                <span className="text-[10px] text-[var(--text-secondary)] opacity-0 group-hover:opacity-60 transition-opacity font-mono whitespace-nowrap ml-4">src/projects</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: SKILLS & SPOTLIGHT */}
                                <div>
                                    <h2 className="text-sm font-bold text-[var(--text-primary)] mb-4 tracking-wider uppercase opacity-80">Skills & Expertise</h2>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {['React', 'Next.js', 'Typescript', 'Node.js', 'Go', 'Docker', 'AWS', 'PostgreSQL', 'Python'].map(skill => (
                                            <span key={skill} className="px-2 py-1 bg-[var(--bg-panel)] border border-[var(--border)] rounded-sm text-xs text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] cursor-default transition-all">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <h2 className="text-sm font-bold text-[var(--text-primary)] mb-4 tracking-wider uppercase opacity-80">Featured Walkthrough</h2>
                                    <div className="space-y-4">
                                        <div
                                            onClick={() => {
                                                const p = PROJECTS_DATA.find(p => p.featured);
                                                if (p) onOpenFile({ id: p.id, title: `${p.title}.tsx`, type: 'detail', data: p });
                                            }}
                                            className="p-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-sm hover:border-[var(--accent)] transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0">
                                                    <Zap size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Spotlight: {PROJECTS_DATA.find(p => p.featured)?.title || 'Flagship Project'}</h3>
                                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">A deep dive into my most sophisticated work. Click to see the architecture and implementation.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-sm hover:border-[var(--accent)] transition-all cursor-pointer group">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)] shrink-0">
                                                    <GitBranch size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Open Source Contributions</h3>
                                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Check out how I contribute back to the community and collaborate on scalable systems.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 p-4 border border-[var(--border)] border-dashed rounded-sm">
                                            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mb-2">
                                                <div className="w-2 h-2 rounded-full bg-[var(--info)] animate-pulse" />
                                                <span>Currently available for projects</span>
                                            </div>
                                            <div className="text-[10px] text-[var(--text-secondary)] font-mono opacity-60">
                                                Last indexed: {new Date().toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="h-full flex flex-col bg-[var(--bg-main)] relative">
                <div className={`absolute md:relative top-9 md:top-0 left-0 w-full z-30 transition-all duration-300 ease-in-out md:translate-y-0 ${!isNavBarVisible ? '-translate-y-[71px] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                    <Breadcrumbs path={path} />
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pt-[71px] md:pt-0" onScroll={onScroll}>
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
                            <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2 font-sans">
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
                                                <span className="text-[var(--text-primary)] font-sans text-sm font-semibold truncate max-w-[150px]">
                                                    {p.title}
                                                </span>
                                            </div>
                                            <ExternalLink size={12} className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                                        </div>
                                        <p className="text-[var(--text-secondary)] text-xs line-clamp-2 mb-4 h-8 font-sans">
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
                                className="group flex items-center gap-3 px-6 py-3 bg-[var(--accent)] text-[var(--accent-fg)] rounded-md hover:bg-[var(--accent)]/90 transition-all font-sans text-sm font-medium shadow-md"
                            >
                                <Terminal size={16} className="text-[var(--accent-fg)]" />
                                <span className="tracking-wide">Explore All Projects</span>
                            </button>
                        </div>

                        {/* CONTRIBUTION MAP - THEME AWARE */}
                        <CanvasContributionMap theme={theme} />
                        {/* RECENT ACTIVITY */}
                        <div className="mb-12">
                            <h2 className="text-sm font-bold text-[var(--text-secondary)] mb-4 flex items-center gap-2 font-sans uppercase tracking-wider">
                                <GitBranch size={14} className="text-[var(--info)]" /> Recent Activity
                            </h2>
                            <div className="space-y-2">
                                {recentActivity.map((act, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm bg-[var(--bg-panel)] border border-[var(--border)] p-3 rounded hover:border-[var(--accent)] hover:bg-[var(--bg-activity)] transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--info)]" />
                                            <span className="text-[var(--text-secondary)] font-sans">{act.action} <span className="text-[var(--text-primary)] font-bold group-hover:text-[var(--accent)] cursor-pointer decoration-dotted underline-offset-4">{act.target}</span></span>
                                        </div>
                                        <span className="text-xs text-[var(--text-secondary)] font-sans opacity-70">{act.time}</span>
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
        const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
            const saved = localStorage.getItem('projects_view_mode');
            return (saved === 'grid' || saved === 'list') ? saved : (easyMode ? 'grid' : 'list');
        });

        useEffect(() => {
            localStorage.setItem('projects_view_mode', viewMode);
        }, [viewMode]);

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

        if (easyMode) {
            return (
                <div className="h-full flex flex-col bg-[var(--bg-main)]">
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-12 py-12" onScroll={onScroll}>
                        <div className="max-w-6xl mx-auto">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">Project Portfolio</h1>
                                    <p className="text-[var(--text-secondary)] opacity-80 text-lg max-w-2xl">
                                        A curated collection of my most significant engineering projects, ranging from immersive web experiences to low-level system internal tools.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-sm border transition-all text-sm font-bold
                                            ${showFilters ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'bg-[var(--bg-activity)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}
                                        `}
                                    >
                                        <Filter size={16} /> Filters
                                    </button>
                                </div>
                            </div>

                            {showFilters && (
                                <div className="mb-12 p-8 bg-[var(--bg-activity)]/40 border border-[var(--border)] rounded-sm animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4 opacity-60">Tech Stack</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {allTech.map(t => (
                                                    <button key={t} onClick={() => toggleFilter(t, setTechFilters)}
                                                        className={`px-3 py-1 text-xs rounded-sm border transition-all 
                                                            ${techFilters.includes(t) ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'}`}>
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4 opacity-60">Core Languages</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {allLanguages.map(l => (
                                                    <button key={l} onClick={() => toggleFilter(l, setLangFilters)}
                                                        className={`px-3 py-1 text-xs rounded-sm border transition-all
                                                            ${langFilters.includes(l) ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'}`}>
                                                        {l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProjects.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => onOpenFile({ id: p.id, title: `${p.title}.tsx`, type: "detail", data: p })}
                                        className="group relative bg-[var(--bg-activity)]/20 border border-[var(--border)] rounded-sm overflow-hidden cursor-pointer hover:border-[var(--accent)] transition-all flex flex-col h-full"
                                    >
                                        <div className="aspect-video relative overflow-hidden bg-[var(--bg-activity)]">
                                            <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                                <span className="text-white text-xs font-bold flex items-center gap-2">
                                                    View Case Study <ExternalLink size={14} />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 mb-3">
                                                {p.languages?.slice(0, 2).map((lang: any) => (
                                                    <span key={lang.name} className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter border border-[var(--border)] rounded-sm flex items-center gap-1.5 text-[var(--text-secondary)]">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lang.color }} />
                                                        {lang.name}
                                                    </span>
                                                ))}
                                            </div>
                                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent)] transition-colors">{p.title}</h3>
                                            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 md:line-clamp-3 leading-relaxed mb-6 opacity-80">{p.description}</p>

                                            <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between">
                                                {/* Tech stack icons removed for cleaner easy mode */}
                                                <span className="text-[10px] font-mono text-[var(--text-secondary)] opacity-40">v1.0.0</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="h-full flex flex-col bg-[var(--bg-main)] relative">
                {!easyMode && (
                    <div className={`absolute md:relative top-9 md:top-0 left-0 w-full z-30 transition-all duration-300 ease-in-out md:translate-y-0 ${!isNavBarVisible ? '-translate-y-[71px] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                        <Breadcrumbs path={path} />
                    </div>
                )}
                <div className="flex-1 overflow-hidden flex flex-col pt-[71px] md:pt-0">
                    <div className="px-4 py-1.5 md:py-2 border-b border-[var(--border)] bg-[var(--bg-panel)] flex flex-row justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="text-[var(--text-secondary)] text-[10px] md:text-xs uppercase tracking-widest font-sans font-bold flex items-center gap-2">
                                <LayoutGrid size={13} className="text-[var(--accent)]" />
                                <span className="hidden sm:inline">PROJECTS EXPLORER</span>
                                <span className="sm:hidden">PROJECTS</span>
                            </div>
                        </div>

                        <div className="flex items-center bg-[var(--bg-activity)] rounded-sm p-0.5 border border-[var(--border)]">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-sm transition-all ${viewMode === 'list' ? 'bg-[var(--bg-main)] text-[var(--accent)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                title="List View"
                            >
                                <List size={14} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-[var(--bg-main)] text-[var(--accent)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                title="Grid View"
                            >
                                <LayoutGrid size={13} />
                            </button>
                            <div className="w-[1px] h-3 bg-[var(--border)] mx-1" />
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-1.5 rounded-sm transition-all ${showFilters ? 'bg-[var(--bg-main)] text-[var(--accent)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                title="Filter"
                            >
                                <Filter size={14} />
                            </button>
                        </div>
                    </div>

                    {/* FILTERS PANEL */}
                    {showFilters && (
                        <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-activity)]/20 shrink-0">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-2 font-mono">Filter by Technology</div>
                                    <div className="flex gap-2 flex-wrap">
                                        {allTech.map(t => (
                                            <button key={t} onClick={() => toggleFilter(t, setTechFilters)}
                                                className={`px-2 py-0.5 text-[10px] border rounded-sm font-mono transition-all ${techFilters.includes(t) ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-fg)]' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'}`}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-2 font-mono">Filter by Language</div>
                                    <div className="flex gap-2 flex-wrap">
                                        {allLanguages.map(l => (
                                            <button key={l} onClick={() => toggleFilter(l, setLangFilters)}
                                                className={`px-2 py-0.5 text-[10px] border rounded-sm font-mono transition-all ${langFilters.includes(l) ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-fg)]' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'}`}>
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONTENT AREA */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-8 pt-0 pb-8" onScroll={onScroll}>
                        <div className="max-w-6xl mx-auto w-full pt-1 md:pt-2 pb-4">
                            {filteredProjects.length === 0 ? (
                                <div className="text-center text-[var(--text-secondary)] mt-20 font-mono text-sm">No extensions found matching your criteria.</div>
                            ) : (
                                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-1"}>
                                    {filteredProjects.map(p => (
                                        <div
                                            key={p.id}
                                            onClick={() => onOpenFile({ id: p.id, title: `${p.title}.tsx`, type: "detail", data: p })}
                                            className={`
                                            group border border-transparent hover:bg-[var(--bg-activity)] cursor-pointer transition-all
                                            ${viewMode === 'grid'
                                                    ? 'bg-[var(--bg-panel)] border-[var(--border)] flex flex-col h-full rounded-sm hover:border-[var(--accent)]'
                                                    : 'flex flex-row items-start gap-4 p-2 rounded-sm hover:bg-[var(--bg-activity)]'
                                                }
                                        `}
                                        >
                                            {/* IMAGE / ICON */}
                                            <div className={viewMode === 'grid' ? "h-32 w-full bg-[var(--bg-activity)] relative overflow-hidden shrink-0" : "w-16 h-16 md:w-24 md:h-24 bg-[var(--bg-activity)] shrink-0 border border-[var(--border)]"}>
                                                <img
                                                    src={p.image}
                                                    alt={p.title}
                                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                                />
                                            </div>

                                            {/* CONTENT */}
                                            <div className={`flex-1 min-w-0 ${viewMode === 'grid' ? 'p-3' : 'py-1 flex flex-col justify-between'}`}>
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-bold text-[var(--text-primary)] text-sm md:text-base font-sans group-hover:text-[var(--accent)] transition-colors">
                                                                {p.title}
                                                            </h3>
                                                            {viewMode === 'list' && (
                                                                <span className="hidden md:inline-flex px-1.5 py-0.5 rounded-sm bg-[var(--bg-main)] text-[10px] text-[var(--text-secondary)] border border-[var(--border)] font-mono">
                                                                    v1.{p.id.length}.0
                                                                </span>
                                                            )}
                                                        </div>
                                                        {viewMode === 'grid' && p.links && 'live' in p.links && <Globe size={12} className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />}
                                                    </div>

                                                    <div className="flex items-center gap-2 mb-2">
                                                        {p.languages?.slice(0, 2).map((lang: any) => (
                                                            <div key={lang.name} className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)] bg-[var(--bg-activity)] px-1.5 py-0.5 rounded-sm border border-[var(--border)]">
                                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lang.color }} />
                                                                {lang.name}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 md:line-clamp-1 mb-2 font-sans opacity-80">
                                                        {p.description}
                                                    </p>
                                                </div>

                                                {viewMode === 'list' && (
                                                    <div className="flex gap-1 mt-1 flex-wrap">
                                                        {p.tech?.map((t: string) => (
                                                            <span key={t} className="text-[10px] px-1.5 py-0.5 bg-[var(--bg-main)] text-[var(--text-secondary)] rounded-sm border border-[var(--border)]">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'detail' && data) {
        if (easyMode) {
            return (
                <div className="h-full flex flex-col bg-[var(--bg-main)]">
                    <div className="flex-1 overflow-y-auto custom-scrollbar" onScroll={onScroll}>
                        {/* Immersive Detail Header */}
                        <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
                            <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                                <div className="max-w-5xl mx-auto">
                                    <div className="flex items-center gap-3 mb-6">
                                        {data.languages?.map((lang: any) => (
                                            <span key={lang.name} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-sm text-[10px] font-bold text-white uppercase tracking-widest">
                                                {lang.name}
                                            </span>
                                        ))}
                                    </div>
                                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight animate-in slide-in-from-left-4 duration-700">{data.title}</h1>
                                    <div className="flex flex-wrap gap-4">
                                        {data.links?.live && (
                                            <a href={data.links.live} target="_blank" rel="noopener noreferrer"
                                                className="px-8 py-3 bg-[var(--accent)] text-white text-sm font-bold rounded-sm shadow-xl shadow-[var(--accent)]/30 hover:scale-105 transition-transform flex items-center gap-2">
                                                Launch Application <Globe size={18} />
                                            </a>
                                        )}
                                        {data.links?.github && (
                                            <a href={data.links.github} target="_blank" rel="noopener noreferrer"
                                                className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold rounded-sm hover:bg-white/20 transition-all flex items-center gap-2">
                                                <Github size={18} /> Source Code
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-5xl mx-auto px-8 md:px-16 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                            <div className="lg:col-span-2 space-y-12">
                                <section>
                                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">
                                        <div className="w-2 h-8 bg-[var(--accent)] rounded-sm" /> Narrative
                                    </h2>
                                    <p className="text-lg text-[var(--text-secondary)] leading-loose opacity-90 font-medium">
                                        {data.longDescription || data.description}
                                    </p>
                                </section>

                                {data.architecture && (
                                    <section>
                                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">System Architecture</h2>
                                        <div className="bg-[var(--bg-activity)] border border-[var(--border)] rounded-sm p-8 overflow-hidden relative">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <Code2 size={120} />
                                            </div>
                                            <pre className="relative z-10 font-mono text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                                                {data.architecture}
                                            </pre>
                                        </div>
                                    </section>
                                )}

                                {data.snippet && (
                                    <section>
                                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Core Implementation</h2>
                                        <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-sm overflow-hidden shadow-lg">
                                            <div className="bg-[var(--bg-activity)] px-4 py-2 border-b border-[var(--border)] flex justify-between items-center">
                                                <span className="text-xs font-mono text-[var(--text-secondary)]">implementation.ts</span>
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                                                </div>
                                            </div>
                                            <div className="p-6 overflow-x-auto custom-scrollbar">
                                                <pre className="font-mono text-xs text-[var(--success)] leading-relaxed">{data.snippet}</pre>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </div>

                            <div className="space-y-12">
                                <div className="p-8 bg-[var(--bg-activity)]/40 border border-[var(--border)] rounded-sm sticky top-8">
                                    {/* Switched to standard VS Code like Project Details to match authentic look */}
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-xs uppercase font-bold text-[var(--text-secondary)] mb-4 tracking-wider font-sans">Technologies</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {data.tech?.map((t: string) => (
                                                    <span key={t} className="px-2 py-1 bg-[var(--bg-main)] text-[var(--text-primary)] text-[11px] rounded-sm border border-[var(--border)] font-sans">{t}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xs uppercase font-bold text-[var(--text-secondary)] mb-4 tracking-wider font-sans">Resources</h3>
                                            <div className="text-xs space-y-3 text-[var(--text-primary)] font-sans">
                                                <div className="flex justify-between py-1.5 border-b border-[var(--border)] border-dashed">
                                                    <span>Version</span>
                                                    <span className="text-[var(--text-secondary)] font-mono">{data.deployHistory?.[0]?.version || 'v1.0.0'}</span>
                                                </div>
                                                <div className="flex justify-between py-1.5 border-b border-[var(--border)] border-dashed">
                                                    <span>Last Update</span>
                                                    <span className="text-[var(--text-secondary)]">Recently</span>
                                                </div>
                                                <div className="flex justify-between py-1.5">
                                                    <span>License</span>
                                                    <span className="text-[var(--text-secondary)] font-mono">MIT</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onOpenFile({ id: 'projects.tsx', title: 'projects.tsx', type: 'projects' })}
                                        className="w-full mt-12 py-4 bg-[var(--bg-activity)] border border-[var(--border)] rounded-sm text-[var(--text-primary)] text-sm font-bold hover:bg-[var(--bg-panel)] transition-all flex items-center justify-center gap-2"
                                    >
                                        Back to Assignments
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="h-full flex flex-col bg-[var(--bg-main)] relative">
                {!easyMode && (
                    <div className={`absolute md:relative top-9 md:top-0 left-0 w-full z-30 transition-all duration-300 ease-in-out md:translate-y-0 ${!isNavBarVisible ? '-translate-y-[71px] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                        <Breadcrumbs path={path} />
                    </div>
                )}
                <div className="flex-1 overflow-y-auto custom-scrollbar pt-[71px] md:pt-0" onScroll={onScroll}>
                    {/* EXTENSION HEADER */}
                    <div className="px-4 md:px-12 max-w-5xl mx-auto w-full py-8">
                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                            <div className="w-32 h-32 bg-[var(--bg-activity)] border border-[var(--border)] shrink-0 shadow-sm relative overflow-hidden">
                                <img
                                    src={data.image}
                                    alt={data.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                                <h1 className="text-3xl font-sans font-bold text-[var(--text-primary)] mb-2 flex items-center gap-3">
                                    {data.title}
                                </h1>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {data.languages?.map((lang: any) => (
                                        <div key={lang.name} className="flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[var(--bg-activity)] border border-[var(--border)] text-xs text-[var(--text-primary)]">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                                            {lang.name}
                                            <span className="text-[var(--text-secondary)] scale-90">{lang.percent}%</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-base text-[var(--text-primary)] mb-4 font-sans max-w-2xl leading-relaxed">
                                    {data.description}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {data.links?.live && (
                                        <a href={data.links.live} target="_blank" rel="noopener noreferrer"
                                            className="px-4 py-1.5 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-[var(--accent-fg)] text-sm font-medium rounded-sm transition-all shadow-sm flex items-center gap-2">
                                            Run Project <Globe size={14} />
                                        </a>
                                    )}
                                    {data.links?.github && (
                                        <a href={data.links.github} target="_blank" rel="noopener noreferrer"
                                            className="px-4 py-1.5 bg-[var(--bg-activity)] hover:bg-[var(--bg-panel)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-medium rounded-sm transition-all flex items-center gap-2">
                                            <Github size={14} /> Repository
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* TABS */}
                        <div className="flex items-center gap-6 border-b border-[var(--border)] mt-1">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`px-1 py-3 text-sm font-sans border-b-2 font-medium transition-colors ${activeTab === 'details' ? 'border-[var(--accent)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                Details
                            </button>
                            {data.architecture && (
                                <button
                                    onClick={() => setActiveTab('architecture')}
                                    className={`px-1 py-3 text-sm font-sans border-b-2 font-medium transition-colors ${activeTab === 'architecture' ? 'border-[var(--accent)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                >
                                    Architecture
                                </button>
                            )}
                            {data.snippet && (
                                <button
                                    onClick={() => setActiveTab('implementation')}
                                    className={`px-1 py-3 text-sm font-sans border-b-2 font-medium transition-colors ${activeTab === 'implementation' ? 'border-[var(--accent)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                >
                                    Core Implementation
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8 mt-6">
                            {/* MAIN CONTENT AREA */}
                            <div className="min-w-0">
                                {/* DETAILS TAB */}
                                {activeTab === 'details' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="text-[var(--text-primary)] opacity-90 font-sans leading-7 mb-6">
                                            <p className="whitespace-pre-wrap text-[15px] leading-relaxed mt-0 pt-0">
                                                {data.longDescription?.trim()}
                                            </p>
                                        </div>

                                        {/* Fixed Size Screenshot */}
                                        <div className="rounded-sm overflow-hidden border border-[var(--border)] bg-[var(--bg-activity)]/20 shadow-xl max-w-2xl w-full">
                                            <img
                                                src={data.image}
                                                alt={`${data.title} Screenshot`}
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* ARCHITECTURE TAB */}
                                {activeTab === 'architecture' && data.architecture && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="bg-[var(--bg-activity)]/30 border border-[var(--border)] rounded-sm p-6 overflow-x-auto custom-scrollbar">
                                            <pre className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">{data.architecture}</pre>
                                        </div>
                                    </div>
                                )}

                                {/* CORE IMPLEMENTATION TAB */}
                                {activeTab === 'implementation' && data.snippet && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-sm overflow-hidden shadow-lg">
                                            <div className="bg-[var(--bg-activity)] px-4 py-2 border-b border-[var(--border)] flex justify-between items-center">
                                                <span className="text-xs font-mono text-[var(--text-secondary)]">implementation.ts</span>
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                                                </div>
                                            </div>
                                            <div className="p-6 overflow-x-auto custom-scrollbar">
                                                <pre className="font-mono text-xs text-[var(--success)] leading-relaxed">{data.snippet}</pre>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* SIDEBAR */}
                            <div className="space-y-8 lg:border-l lg:border-[var(--border)] lg:pl-8 mt-8 lg:mt-0 pt-8 lg:pt-0 border-t lg:border-t-0 border-[var(--border)]">
                                <div>
                                    <h3 className="text-xs uppercase font-bold text-[var(--text-secondary)] mb-4 tracking-wider font-sans">Technologies</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {data.tech?.map((t: string) => (
                                            <span key={t} className="px-2 py-1 bg-[var(--bg-activity)] text-[var(--text-primary)] text-[11px] rounded-sm border border-[var(--border)] font-sans">{t}</span>
                                        ))}
                                    </div>
                                </div>



                                <div>
                                    <h3 className="text-xs uppercase font-bold text-[var(--text-secondary)] mb-4 tracking-wider font-sans">Resources</h3>
                                    <div className="text-xs space-y-3 text-[var(--text-primary)] font-sans">
                                        <div className="flex justify-between py-1.5 border-b border-[var(--border)] border-dashed">
                                            <span>Version</span>
                                            <span className="text-[var(--text-secondary)] font-mono">{data.deployHistory?.[0]?.version || 'v2.5'}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-[var(--border)] border-dashed">
                                            <span>Last Update</span>
                                            <span className="text-[var(--text-secondary)]">2 days ago</span>
                                        </div>
                                        <div className="flex justify-between py-1.5">
                                            <span>License</span>
                                            <span className="text-[var(--text-secondary)] font-mono">MIT</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'readme') {
        return (
            <div className="h-full flex flex-col relative">
                {!easyMode && (
                    <div className={`absolute md:relative top-9 md:top-0 left-0 w-full z-30 transition-all duration-300 ease-in-out md:translate-y-0 ${!isNavBarVisible ? '-translate-y-[71px] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                        <Breadcrumbs path={path} />
                    </div>
                )}
                <div className="flex-1 overflow-y-auto custom-scrollbar pt-[71px] md:pt-0">
                    <div className="p-4 md:p-12 max-w-4xl mx-auto w-full flex flex-col">
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
            </div>
        );
    }

    if (type === 'pdf') {
        return (
            <div className="h-full flex flex-col bg-[var(--bg-main)] relative">
                {!easyMode && (
                    <div className={`absolute md:relative top-9 md:top-0 left-0 w-full z-30 transition-all duration-300 ease-in-out md:translate-y-0 ${!isNavBarVisible ? '-translate-y-[71px] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                        <Breadcrumbs path={path} />
                    </div>
                )}
                <div className="flex-1 flex flex-col min-h-0 pt-[71px] md:pt-0">
                    <div className="flex items-center justify-between px-4 py-1.5 border-b border-[var(--border)] bg-[var(--bg-panel)]">
                        <div className="flex items-center gap-2 text-[var(--accent)] font-mono font-bold text-[11px]">
                            <FileText size={14} />
                            <span>RESUME.PDF</span>
                        </div>
                        <a
                            href="./resume.pdf"
                            download
                            className="flex items-center gap-2 px-3 py-1 bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-[var(--accent-fg)] text-[10px] rounded-[2px] transition-all"
                        >
                            <Zap size={12} /> Download PDF
                        </a>
                    </div>
                    <div className="flex-1 bg-[#1e1e1e] overflow-hidden">
                        <iframe
                            src="./resume.pdf#view=Fit"
                            className="w-full h-full border-none"
                            style={{ minHeight: 'calc(100vh - 120px)' }}
                            title="Arnav Resume"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
