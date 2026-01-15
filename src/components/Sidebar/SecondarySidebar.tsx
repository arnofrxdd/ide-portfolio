import { useState, useEffect } from 'react';
import {
    Brain, BarChart3, Sparkles,
    Activity, Code2, Globe, Github, Mail, Linkedin, FileText, X
} from 'lucide-react';
import { PROJECTS_DATA } from '../../data/projects';

interface SecondarySidebarProps {
    isOpen: boolean;
    activeTabId: string;
    onClose: () => void;
}

export const SecondarySidebar = ({ isOpen, activeTabId, onClose }: SecondarySidebarProps) => {
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

    useEffect(() => {
        if (!isOpen) return;

        setLoading(true);
        const timer = setTimeout(() => {
            if (activeTabId === 'home') {
                setAiInsight("Portfolio Root: This dashboard provides a high-level overview of technical deployments, system contributions, and core competencies. Navigation focus: Exploration of complex builds.");
            } else if (currentProject) {
                setAiInsight(`Technical Audit: ${currentProject.title}. This ${currentProject.type} demonstrates advanced implementation of ${currentProject.tech[0]} and ${currentProject.tech[1]}. Optimized for performance and scalability.`);
            } else if (activeTabId.endsWith('.json')) {
                setAiInsight("JSON Configuration: Source data for project hydration. Ensures strict type-safety and structured metadata across the portfolio engine.");
            } else {
                setAiInsight("Viewing System File: Analyzing internal component logic and styling tokens. Active theme context applied to current render buffer.");
            }
            setLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, [activeTabId, isOpen, currentProject]);

    return (
        <>
            {isOpen && (
                <div style={{ width: width }} className="relative z-20 bg-[var(--bg-panel)] border-l border-[var(--border)] flex flex-col h-full overflow-hidden">
                    <div
                        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[var(--accent)] transition-colors z-50 opacity-0 hover:opacity-100"
                        onMouseDown={startResizing}
                    />
                    {/* Header */}
                    <div className="h-9 px-4 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-activity)]/50">
                        <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                            <Sparkles size={12} className="text-[var(--accent)]" />
                            {currentProject ? 'Project Intel' : 'System Intel'}
                        </span>
                        <button onClick={onClose} className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                            <X size={14} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">

                        {/* ANALYSIS SECTION */}
                        <section>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-3 select-none">
                                <Brain size={12} className="text-[var(--info)]" /> Technical Summary
                            </div>
                            <div className="bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 relative group overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)] opacity-50" />
                                {loading ? (
                                    <div className="flex gap-1 items-center justify-center py-2">
                                        <span className="w-1 h-1 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1 h-1 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1 h-1 bg-[var(--accent)] rounded-full animate-bounce" />
                                    </div>
                                ) : (
                                    <p className="text-[12px] font-sans leading-relaxed text-[var(--text-primary)] opacity-90">
                                        {aiInsight}
                                    </p>
                                )}
                            </div>
                        </section>

                        {/* TECH STACK / STATS */}
                        <section>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-2 select-none">
                                <BarChart3 size={12} className="text-[var(--success)]" /> {currentProject ? 'Build Composition' : 'Core Proficiency'}
                            </div>
                            <div className="space-y-3">
                                {(currentProject?.languages || [
                                    { name: 'TypeScript', percent: 95, color: '#3178c6' },
                                    { name: 'React', percent: 92, color: '#61dafb' },
                                    { name: 'Node.js', percent: 88, color: '#339933' },
                                    { name: 'C++', percent: 85, color: '#00599c' }
                                ]).map((lang: any, i: number) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-[11px] font-sans">
                                            <span className="text-[var(--text-primary)] font-medium">{lang.name}</span>
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
                        </section>

                        {/* REPOSITORY METADATA */}
                        <section className="space-y-2">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-2 select-none">
                                <Activity size={12} className="text-[var(--warning)]" /> Repository Metadata
                            </div>

                            <div className="bg-[var(--bg-activity)]/50 border border-[var(--border)] p-3 rounded space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Code2 size={13} className="text-[var(--info)]" />
                                        <span className="text-[11px] font-sans text-[var(--text-secondary)]">Release</span>
                                    </div>
                                    <span className="text-[11px] font-sans text-[var(--text-primary)]">
                                        {currentProject?.date || '2025.stable'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Globe size={13} className="text-[var(--success)]" />
                                        <span className="text-[11px] font-sans text-[var(--text-secondary)]">Version</span>
                                    </div>
                                    <span className="text-[11px] font-sans text-[var(--text-primary)] font-mono">
                                        {currentProject?.deployHistory?.[0]?.version || 'v4.2.1'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Activity size={13} className="text-[var(--accent)]" />
                                        <span className="text-[11px] font-sans text-[var(--text-secondary)]">Status</span>
                                    </div>
                                    <span className="text-[11px] font-sans text-[var(--success)] font-bold">
                                        {currentProject?.deployHistory?.[0]?.status === 'success' ? 'VERIFIED' : 'ACTIVE'}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* ACTIONS SECTION */}
                        <section>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-2 select-none">
                                <Mail size={12} className="text-[var(--secondary)]" /> {currentProject ? 'Project Links' : 'Connect'}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {currentProject ? (
                                    <>
                                        {currentProject.links?.github && (
                                            <a href={currentProject.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[var(--bg-activity)] border border-[var(--border)] p-2 rounded hover:bg-[var(--bg-main)] hover:border-[var(--accent)] transition-all group col-span-2">
                                                <Github size={12} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
                                                <span className="text-[11px] font-sans">View Source Code</span>
                                            </a>
                                        )}
                                        {('live' in currentProject.links) && currentProject.links.live && (
                                            <a href={currentProject.links.live} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[var(--bg-activity)] border border-[var(--border)] p-2 rounded hover:bg-[var(--bg-main)] hover:border-[var(--accent)] transition-all group col-span-2">
                                                <Globe size={12} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
                                                <span className="text-[11px] font-sans">Launch Live Demo</span>
                                            </a>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <a href="https://github.com/arnofrxdd" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[var(--bg-activity)] border border-[var(--border)] p-2 rounded hover:bg-[var(--bg-main)] hover:border-[var(--accent)] transition-all group">
                                            <Github size={12} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
                                            <span className="text-[11px] font-sans">GitHub</span>
                                        </a>
                                        <a href="https://linkedin.com/in/arnofrxdd" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[var(--bg-activity)] border border-[var(--border)] p-2 rounded hover:bg-[var(--bg-main)] hover:border-[var(--accent)] transition-all group">
                                            <Linkedin size={12} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
                                            <span className="text-[11px] font-sans">LinkedIn</span>
                                        </a>
                                        <a href="mailto:arnav@example.com" className="flex items-center gap-2 bg-[var(--bg-activity)] border border-[var(--border)] p-2 rounded hover:bg-[var(--bg-main)] hover:border-[var(--accent)] transition-all group">
                                            <Mail size={12} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
                                            <span className="text-[11px] font-sans">Email</span>
                                        </a>
                                        <a href="/resume.pdf" target="_blank" className="flex items-center gap-2 bg-[var(--bg-activity)] border border-[var(--border)] p-2 rounded hover:bg-[var(--bg-main)] hover:border-[var(--accent)] transition-all group">
                                            <FileText size={12} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
                                            <span className="text-[11px] font-sans">Resume</span>
                                        </a>
                                    </>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-activity)]/30 mt-auto">
                        <StatusFooter />
                    </div>
                </div>
            )}
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

