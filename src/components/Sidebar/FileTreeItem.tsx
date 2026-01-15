import React from 'react';
import { ChevronDown, X, type LucideIcon } from 'lucide-react';

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
    onContextMenu?: (e: React.MouseEvent, id: string, type: 'file' | 'folder') => void;
    isDragOver?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
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
    onDragStart,
    onContextMenu,
    isDragOver,
    onMouseEnter,
    onMouseLeave
}: FileTreeItemProps) => (
    <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
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
        onContextMenu={(e) => {
            if (onContextMenu && draggableId) {
                onContextMenu(e, draggableId, hasChildren ? 'folder' : 'file');
            }
        }}
        className={`
            group flex items-center h-[22px] cursor-pointer select-none relative overflow-hidden
            ${isActive
                ? 'bg-[#37373d] text-white border-l-0 border-[var(--accent)] outline outline-1 outline-[var(--border)] -outline-offset-1'
                : 'hover:bg-[#2a2d2e]'}
        `}
    >
        {isDragOver && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--accent)] z-50 pointer-events-none" />
        )}

        {/* Indentation Spacer with Lines */}
        <div className="flex h-full shrink-0">
            {Array.from({ length: depth }).map((_, i) => (
                <div
                    key={i}
                    className="w-[12px] h-full border-r border-white/5"
                />
            ))}
        </div>

        {/* Action/Chevron Area */}
        <div className="w-5 flex items-center justify-center shrink-0">
            {hasChildren ? (
                <div
                    onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
                    className={`transition-transform duration-150 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
                >
                    <ChevronDown size={14} className="text-[var(--text-secondary)]" />
                </div>
            ) : (
                <span className="w-4" />
            )}
        </div>

        {/* Content Area */}
        <div className="flex items-center gap-1.5 min-w-0 pr-2">
            <Icon size={16} className={`${color} shrink-0`} />
            <span className={`text-[13px] truncate flex-1 ${isActive ? 'text-white font-normal' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                {name}
            </span>
        </div>

        {/* Close Button (only for Open Editors style) */}
        {showClose && (
            <div
                onClick={(e) => { e.stopPropagation(); onClose?.(); }}
                className="ml-auto px-2 h-full flex items-center opacity-0 group-hover:opacity-100 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
                <X size={14} />
            </div>
        )}
    </div>
);
