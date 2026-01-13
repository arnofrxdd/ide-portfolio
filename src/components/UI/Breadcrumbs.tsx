import React from 'react';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs = ({ path }: { path: string }) => {
    if (!path) return null;
    const parts = path.split('/');

    return (
        <div
            className="
      sticky top-0 z-20
      flex items-center gap-1
      text-[10px] text-[var(--text-secondary)]
      px-4 py-1
      border-b border-[var(--border)]
      bg-[var(--bg-main)]
      font-mono select-none
      "
        >
            <span className="opacity-50">Portfolio</span>
            {parts.map((part, i) => (
                <React.Fragment key={i}>
                    <ChevronRight size={10} className="opacity-50" />
                    <span className={i === parts.length - 1 ? 'text-[var(--text-primary)]' : ''}>
                        {part}
                    </span>
                </React.Fragment>
            ))}
        </div>
    );
};
