import { useState, useEffect, useContext } from 'react';
import {
    Activity, Code2, Globe, Github, Mail, Linkedin, FileText, X,
    ChevronDown, History, ListTree, Link as LinkIcon, Info, UserCircle
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { PROJECTS_DATA } from '../../data/projects';

interface SecondarySidebarProps {
    isOpen: boolean;
    activeTabId: string;
    onClose: () => void;
}

const CollapsibleSection = ({ title, children, defaultOpen = true, icon: Icon }: { title: string, children: React.ReactNode, defaultOpen?: boolean, icon?: any }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-[var(--border)]/30 overflow-hidden">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="h-[22px] flex items-center px-1 bg-[var(--bg-activity)]/20 cursor-pointer hover:bg-[var(--bg-activity)]/40 transition-colors"
            >
                <ChevronDown
                    size={14}
                    className={`text-[var(--text-secondary)] transition-transform duration-150 ${isOpen ? '' : '-rotate-90'}`}
                />
                <div className="flex items-center gap-1.5 ml-1">
                    {Icon && <Icon size={12} className="text-[var(--text-secondary)] opacity-70" />}
                    <span className="text-[11px] font-bold text-[var(--text-secondary)] tracking-tight uppercase select-none">{title}</span>
                </div>
            </div>
            {isOpen && <div className="p-4">{children}</div>}
        </div>
    );
};

export const SecondarySidebar = ({ isOpen, activeTabId, onClose }: SecondarySidebarProps) => {
    const { easyMode } = useContext(ThemeContext);
    const [aiInsight, setAiInsight] = useState('');
    const [loading, setLoading] = useState(false);

    // Find current project if active tab is a project
    const currentProject = PROJECTS_DATA.find(p => p.id === activeTabId || `${p.title}.tsx` === activeTabId);

    const [width, setWidth] = useState(() => {
        const saved = localStorage.getItem('portfolio_secondary_sidebar_width');
        return saved ? parseInt(saved, 10) : 256;
    });
    const [isResizing, setIsResizing] = useState(false);

    // Persist width changes
    useEffect(() => {
        localStorage.setItem('portfolio_secondary_sidebar_width', width.toString());
    }, [width]);

    const startResizing = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const stopResizing = () => {
        setIsResizing(false);
    };

    const resize = (e: MouseEvent) => {
        if (isResizing) {
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 200 && newWidth < 800) {
                setWidth(newWidth);
            }
        }
    };

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [isResizing]);

    useEffect(() => {
        if (isResizing) {
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    }, [isResizing]);

    const getManifestAudit = (tabId: string, project: any) => {
        if (tabId === 'home') {
            return "WORKSPACE_OVERVIEW: This environment is a fully custom-built IDE engine designed to showcase my expertise in React architecture and immersive UI/UX. It features a virtualized file system, theme engine, and integrated deployment analytics.";
        }

        if (project) {
            const techStr = project.tech.slice(0, 3).join(' & ');
            return `ENGINEERING_SPOTLIGHT: "${project.title}" demonstrates my ability to solve complex technical challenges using ${techStr}. This project highlights my focus on ${project.type.toLowerCase()} architecture and high-performance engineering excellence.`;
        }

        const ext = tabId.split('.').pop()?.toLowerCase();
        const baseName = tabId.split('/').pop() || tabId;

        const audits: Record<string, string> = {
            tsx: `UI_ARCHITECTURE: This component in "${baseName}" reflects my proficiency in building modular, scalable React systems. It focuses on clean state management and high-performance rendering patterns.`,
            ts: `CORE_LOGIC: A showcase of robust TypeScript implementation in "${baseName}". I use strict typing and modular design to ensure system reliability and long-term maintainability.`,
            json: `DATA_ORCHESTRATION: This configuration file manages the metadata for the portfolio. It demonstrates my approach to structured data and type-safe project hydration.`,
            css: `DESIGN_SYSTEM: Part of a custom-built styling architecture. I prioritize CSS variables and themeable tokens to create responsive, pixel-perfect developer interfaces.`,
            md: `DOCUMENTATION: Clear communication is a priority. This manifest provides the technical roadmap and specifications for the current module, ensuring transparency and ease of collaboration.`,
            pdf: `CREDENTIAL_VERIFICATION: Accessing my professional resume. This document captures my technical journey, core competencies, and the value I bring to high-performing engineering teams.`,
            env: `SECURE_ORCHESTRATION: A demonstration of secure environment handling. I maintain strict separation between configuration and code to protect sensitive system tokens.`,
            txt: `TECHNICAL_HISTORY: Historical markers and legacy logs. Every line represents part of the iterative journey in refining this professional developer environment.`
        };

        return audits[ext || ''] || `TECHNICAL_ARTIFACT: Analyzing "${baseName}". This module is a critical part of the portfolio's core engine, contributing to the seamless, integrated experience you see here.`;
    };

    useEffect(() => {
        if (!isOpen) return;

        setLoading(true);
        const timer = setTimeout(() => {
            setAiInsight(getManifestAudit(activeTabId, currentProject));
            setLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, [activeTabId, isOpen, currentProject]);

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div
                style={{ width: isOpen ? width : 0 }}
                className={`
                    fixed md:relative top-0 right-0 h-full z-[101] md:z-20
                    bg-[var(--bg-panel)] border-l border-[var(--border)]
                    flex flex-col overflow-hidden
                    transition-all duration-300 ease-in-out md:transition-none
                    ${isOpen ? 'translate-x-0 opacity-100 shadow-2xl md:shadow-none' : 'translate-x-full md:translate-x-0 opacity-0 md:opacity-0 pointer-events-none md:pointer-events-none'}
                `}
            >
                {/* Resize Handle (Desktop Only) */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[var(--accent)] transition-colors z-50 opacity-0 hover:opacity-100 hidden md:block"
                    onMouseDown={startResizing}
                />

                {/* Content Wrapper to maintain width during animation */}
                <div style={{ width: width }} className="flex flex-col h-full shrink-0">
                    {easyMode ? (
                        <>
                            {/* Easy Mode Header */}
                            <div className="h-9 px-4 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-activity)]/50 shrink-0">
                                <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                                    <UserCircle size={14} className="text-[var(--accent)]" />
                                    Portfolio Identity
                                </span>
                                <button onClick={onClose} className="p-1 hover:bg-[var(--bg-activity)] rounded text-[var(--text-secondary)] transition-colors">
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 select-none">
                                {/* Tech Stack - Integrated from Non-Easy Mode */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest opacity-60">{currentProject ? "Project Tech Stack" : "Core Technologies"}</h3>
                                    <div className="bg-[var(--bg-activity)]/20 border border-[var(--border)] p-4 rounded-lg space-y-4">
                                        {(currentProject?.languages || [
                                            { name: 'TypeScript', percent: 95, color: '#3178c6' },
                                            { name: 'React', percent: 92, color: '#61dafb' },
                                            { name: 'Node.js', percent: 88, color: '#339933' },
                                            { name: 'Python', percent: 85, color: '#3776ab' }
                                        ]).map((lang: any, i: number) => (
                                            <div key={i} className="space-y-1.5">
                                                <div className="flex justify-between text-[11px] font-sans">
                                                    <span className="text-[var(--text-primary)] opacity-80">{lang.name}</span>
                                                    <span className="text-[var(--text-secondary)] font-mono text-[10px]">{lang.percent}%</span>
                                                </div>
                                                <div className="h-1 bg-[var(--bg-panel)] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${lang.percent}%`,
                                                            backgroundColor: lang.color || 'var(--accent)'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Active Module */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest opacity-60">Current Context</h3>
                                    <div className="bg-[var(--bg-activity)]/30 border border-[var(--border)] p-4 rounded-lg relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)] opacity-40" />
                                        <div className="flex items-center gap-2 mb-2">
                                            <Activity size={12} className="text-[var(--accent)]" />
                                            <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-tight">{currentProject ? 'Project Spotlight' : 'System Manifest'}</span>
                                        </div>
                                        <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
                                            {aiInsight}
                                        </p>
                                    </div>
                                </div>

                                {/* Deployment Metrics */}
                                <div className="space-y-3">
                                    <CollapsibleSection title="Deployment Metrics" icon={Activity} defaultOpen={false}>
                                        <div className="bg-[var(--bg-activity)]/20 border border-[var(--border)] p-3 rounded-lg space-y-3">
                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-2">
                                                    <Code2 size={13} className="text-[var(--text-secondary)] opacity-60" />
                                                    <span className="text-[11px] font-sans text-[var(--text-secondary)]">Version</span>
                                                </div>
                                                <span className="text-[11px] font-sans text-[var(--text-primary)] font-mono opacity-80">
                                                    {currentProject?.deployHistory?.[0]?.version || 'v1.4.2'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-2">
                                                    <Globe size={13} className="text-[var(--text-secondary)] opacity-60" />
                                                    <span className="text-[11px] font-sans text-[var(--text-secondary)]">Status</span>
                                                </div>
                                                <span className="text-[11px] font-sans text-[var(--success)] font-bold">
                                                    {currentProject?.deployHistory?.[0]?.status === 'success' ? 'STABLE' : 'PRODUCTION'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-2">
                                                    <Activity size={13} className="text-[var(--text-secondary)] opacity-60" />
                                                    <span className="text-[11px] font-sans text-[var(--text-secondary)]">Uptime</span>
                                                </div>
                                                <span className="text-[11px] font-sans text-[var(--text-primary)] font-mono opacity-80">99.99%</span>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                </div>

                                {/* Connect Actions */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest opacity-60">Connect</h3>
                                    <div className="flex flex-col gap-2">
                                        {currentProject ? (
                                            <>
                                                {currentProject.links?.github && (
                                                    <a href={currentProject.links.github} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-[11px] font-bold hover:bg-[var(--bg-activity)]/80 transition-all">
                                                        <Github size={12} />
                                                        Source Code
                                                    </a>
                                                )}
                                                {/* Check for 'live' link safely since its optional in type */}
                                                {(currentProject.links as any).live && (
                                                    <a href="https://linkedin.com/in/arnav" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-[11px] font-bold hover:bg-[var(--bg-activity)]/80 transition-all">
                                                        <Linkedin size={12} />
                                                        Get in Touch
                                                    </a>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <a href="https://github.com/arnofrxdd" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-[11px] font-bold hover:bg-[var(--bg-activity)]/80 transition-all">
                                                    <Github size={12} />
                                                    GitHub
                                                </a>
                                                <a href="https://linkedin.com/in/arnav" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-[11px] font-bold hover:bg-[var(--bg-activity)]/80 transition-all">
                                                    <Linkedin size={12} />
                                                    LinkedIn
                                                </a>
                                                <a href="mailto:arnav@example.com" className="flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-[11px] font-bold hover:bg-[var(--bg-activity)]/80 transition-all">
                                                    <Mail size={12} />
                                                    Email
                                                </a>
                                                <a href="/resume.pdf" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--bg-activity)] border border-[var(--border)] text-[var(--text-primary)] text-[11px] font-bold hover:bg-[var(--bg-activity)]/80 transition-all">
                                                    <FileText size={12} />
                                                    Resume
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Standard Header */}
                            <div className="h-9 px-4 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-activity)]/50 shrink-0">
                                <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                                    {currentProject ? 'Project Details' : 'Portfolio Manifest'}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button onClick={onClose} className="p-1 hover:bg-[var(--bg-activity)] rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar select-none">
                                {/* 1. OUTLINE / TECH STACK */}
                                <CollapsibleSection title={currentProject ? "Tech Stack" : "Core Tech"} icon={ListTree}>
                                    <div className="space-y-4">
                                        {(currentProject?.languages || [
                                            { name: 'TypeScript', percent: 95, color: '#3178c6' },
                                            { name: 'React', percent: 92, color: '#61dafb' },
                                            { name: 'Node.js', percent: 88, color: '#339933' },
                                            { name: 'Python', percent: 85, color: '#3776ab' }
                                        ]).map((lang: any, i: number) => (
                                            <div key={i} className="space-y-1.5">
                                                <div className="flex justify-between text-[11px] font-sans">
                                                    <span className="text-[var(--text-primary)] opacity-80">{lang.name}</span>
                                                    <span className="text-[var(--text-secondary)] font-mono text-[10px]">{lang.percent}%</span>
                                                </div>
                                                <div className="h-1 bg-[var(--bg-activity)] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${lang.percent}%`,
                                                            backgroundColor: lang.color || 'var(--accent)'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CollapsibleSection>

                                {/* 2. MANIFEST / AUDIT */}
                                <CollapsibleSection title="Manifest Audit" icon={Info}>
                                    <div className="bg-[var(--bg-activity)]/30 border border-[var(--border)] rounded-sm p-3 relative group">
                                        <div className="absolute top-0 left-0 w-[2px] h-full bg-[var(--accent)] opacity-40" />
                                        {loading ? (
                                            <div className="flex gap-1 items-center justify-center py-1">
                                                <span className="w-1 h-1 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-1 h-1 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-1 h-1 bg-[var(--accent)] rounded-full animate-bounce" />
                                            </div>
                                        ) : (
                                            <p className="text-[12px] font-sans leading-relaxed text-[var(--text-secondary)]">
                                                {aiInsight}
                                            </p>
                                        )}
                                    </div>
                                </CollapsibleSection>

                                {/* 3. TIMELINE / METADATA */}
                                <CollapsibleSection title="Deployment History" icon={History} defaultOpen={false}>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center gap-2">
                                                <Code2 size={13} className="text-[var(--text-secondary)] opacity-60" />
                                                <span className="text-[11px] font-sans text-[var(--text-secondary)]">Version</span>
                                            </div>
                                            <span className="text-[11px] font-sans text-[var(--text-primary)] font-mono opacity-80">
                                                {currentProject?.deployHistory?.[0]?.version || 'v1.4.2'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center gap-2">
                                                <Globe size={13} className="text-[var(--text-secondary)] opacity-60" />
                                                <span className="text-[11px] font-sans text-[var(--text-secondary)]">Status</span>
                                            </div>
                                            <span className="text-[11px] font-sans text-[var(--success)] font-bold">
                                                {currentProject?.deployHistory?.[0]?.status === 'success' ? 'STABLE' : 'PRODUCTION'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center gap-2">
                                                <Activity size={13} className="text-[var(--text-secondary)] opacity-60" />
                                                <span className="text-[11px] font-sans text-[var(--text-secondary)]">Uptime</span>
                                            </div>
                                            <span className="text-[11px] font-sans text-[var(--text-primary)] font-mono opacity-80">99.99%</span>
                                        </div>
                                    </div>
                                </CollapsibleSection>

                                {/* 4. SOCIALS / LINKS */}
                                <CollapsibleSection title="Connect" icon={LinkIcon}>
                                    <div className="grid grid-cols-1 gap-1.5">
                                        {currentProject ? (
                                            <>
                                                {currentProject.links?.github && (
                                                    <a href={currentProject.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 hover:bg-[var(--bg-activity)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                                        <Github size={13} />
                                                        <span className="text-[11px] font-sans">Source Code</span>
                                                    </a>
                                                )}
                                                {('live' in currentProject.links) && currentProject.links.live && (
                                                    <a href={currentProject.links.live} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 hover:bg-[var(--bg-activity)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                                        <Globe size={13} />
                                                        <span className="text-[11px] font-sans">Live Demo</span>
                                                    </a>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <a href="https://github.com/arnofrxdd" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 hover:bg-[var(--bg-activity)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                                    <Github size={13} />
                                                    <span className="text-[11px] font-sans">GitHub</span>
                                                </a>
                                                <a href="https://www.linkedin.com/in/arnav-dalai-557214252/" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 hover:bg-[var(--bg-activity)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                                    <Linkedin size={13} />
                                                    <span className="text-[11px] font-sans">LinkedIn</span>
                                                </a>
                                                <a href="mailto:arnav@example.com" className="flex items-center gap-2 p-2 hover:bg-[var(--bg-activity)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                                    <Mail size={13} />
                                                    <span className="text-[11px] font-sans">Email</span>
                                                </a>
                                                <a href="/resume.pdf" target="_blank" className="flex items-center gap-2 p-2 hover:bg-[var(--bg-activity)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                                    <FileText size={13} />
                                                    <span className="text-[11px] font-sans">Resume</span>
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </CollapsibleSection>
                            </div>
                        </>
                    )}

                    <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-activity)]/30 mt-auto">
                        <StatusFooter />
                    </div>
                </div>
            </div>
        </>
    );
};

const StatusFooter = () => {
    return (
        <div className="flex items-center justify-between text-[11px] font-sans text-[var(--text-secondary)] select-none">
            <div className="flex items-center gap-2 cursor-pointer hover:text-[var(--text-primary)]">
                <div className="flex relative items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--success)]"></div>
                    <div className="w-2 h-2 rounded-full bg-[var(--success)] absolute animate-ping opacity-50"></div>
                </div>
                <span className="font-medium">Open to Work</span>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[var(--text-primary)]">
                <span>Portfolio v2025.3</span>
            </div>
        </div>
    );
};

