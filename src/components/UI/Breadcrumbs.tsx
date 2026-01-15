import React from 'react';
import { ChevronRight, Folder } from 'lucide-react';
import { getFileIcon } from '../../data/fileSystem';

interface BreadcrumbsProps {
    path: string;
}

export const Breadcrumbs = ({ path }: BreadcrumbsProps) => {
    if (!path) return null;
    const parts = path.split('/');

    return (
        <div className="h-6 flex items-center px-2 text-[11px] text-[var(--text-secondary)] bg-[var(--bg-main)] border-b border-[var(--border)] select-none overflow-hidden whitespace-nowrap z-20 shrink-0">
            <div className="flex items-center hover:text-[var(--text-primary)] cursor-pointer group px-0.5 rounded transition-colors">
                <span>Portfolio</span>
            </div>

            {parts.map((part, i) => {
                const isLast = i === parts.length - 1;
                const { icon: Icon, color } = isLast ? getFileIcon(part) : { icon: Folder, color: 'text-[var(--text-secondary)]' };

                return (
                    <React.Fragment key={i}>
                        <ChevronRight size={12} className="mx-0.5 opacity-40 shrink-0" />
                        <div className="flex items-center gap-1 hover:text-[var(--text-primary)] hover:bg-[var(--bg-activity)]/50 cursor-pointer px-1 rounded transition-colors group">
                            <Icon size={14} className={`${color} shrink-0 opacity-80 group-hover:opacity-100`} />
                            <span className={`${isLast ? 'text-[var(--text-primary)]' : ''} truncate`}>
                                {part}
                            </span>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};
