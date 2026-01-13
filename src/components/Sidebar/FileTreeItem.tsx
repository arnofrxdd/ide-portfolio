import React from 'react';
import { ChevronRight, ChevronDown, X, type LucideIcon } from 'lucide-react';

interface FileTreeItemProps {
    depth?: number;
    name: string;
    icon: LucideIcon;
    color: string;
    onClick?: (e: React.MouseEvent) => void;
    isActive?: boolean;
    hasChildren?: boolean;
    isOpen?: boolean;
    onToggle?: () => void;
    onClose?: () => void;
    showClose?: boolean;
    draggableId?: string;
    onDragStart?: (e: React.MouseEvent, id: string) => void;
}

export const FileTreeItem = ({
    depth = 0,
    name,
    icon: Icon,
    color,
    onClick,
    isActive,
    hasChildren,
    isOpen,
    onToggle,
    onClose,
    showClose,
    draggableId,
    onDragStart
}: FileTreeItemProps) => (
    <div
        onMouseDown={(e) => {
            if (!draggableId) return;
            const sx = e.clientX;
            const sy = e.clientY;
            const move = (ev: MouseEvent) => {
                if (Math.hypot(ev.clientX - sx, ev.clientY - sy) > 5) {
                    onDragStart?.({ ...ev, clientX: ev.clientX, clientY: ev.clientY } as unknown as React.MouseEvent, draggableId);
                    cleanup();
                }
            };
            const cleanup = () => {
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', cleanup);
            };
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', cleanup);
        }}
        onClick={(e) => {
            if (hasChildren && onToggle) {
                onToggle();
            } else {
                onClick?.(e);
            }
        }}
        className={`
    flex items-center py-1 px-3 cursor-pointer select-none transition-colors
    ${isActive
                ? 'bg-[var(--selection)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)]'}
  `}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
    >
        {showClose ? (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose?.();
                }}
                className="w-4 h-4 flex items-center justify-center text-slate-500 hover:text-red-400"
            >
                <X size={10} />
            </button>
        ) : hasChildren ? (
            <div
                onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
                className="p-0.5 hover:bg-[var(--bg-panel)] rounded shrink-0"
            >
                {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </div>
        ) : (
            <span className="w-4 shrink-0" />
        )}

        <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Icon size={14} className={`${color} shrink-0`} />
            <span className="text-xs font-mono truncate min-w-0 flex-1">
                {name}
            </span>
        </div>
    </div>
);
