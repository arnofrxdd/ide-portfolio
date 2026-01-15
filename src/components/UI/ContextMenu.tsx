import React from 'react';
import {
    Copy, Scissors, Clipboard, Edit2, Trash2,
    FolderPlus, FilePlus
} from 'lucide-react';

interface ContextMenuProps {
    x: number;
    y: number;
    type: 'tab' | 'explorer-file' | 'explorer-folder' | 'editor';
    id: string;
    onClose: () => void;
    onAction: (action: string, id: string) => void;
}

export const ContextMenu = ({ x, y, type, id, onClose, onAction }: ContextMenuProps) => {
    // Prevent menu from going off-screen
    const menuRef = React.useRef<HTMLDivElement>(null);
    const [style, setStyle] = React.useState<React.CSSProperties>({ left: x, top: y, visibility: 'hidden' });

    React.useEffect(() => {
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const viewportW = window.innerWidth;
            const viewportH = window.innerHeight;

            let nextX = x;
            let nextY = y;

            if (x + rect.width > viewportW) nextX = viewportW - rect.width - 10;
            if (y + rect.height > viewportH) nextY = viewportH - rect.height - 10;

            setStyle({ left: nextX, top: nextY, visibility: 'visible' });
        }
    }, [x, y]);

    const MenuItem = ({ icon: Icon, label, action, shortcut, danger }: any) => (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onAction(action, id);
                onClose();
            }}
            className={`
                w-full flex items-center gap-3 px-3 py-1.5 text-[12px] transition-colors
                ${danger ? 'hover:bg-red-500/20 text-red-500' : 'hover:bg-[var(--selection)]/30 text-[var(--text-primary)]'}
            `}
        >
            <div className="w-4 flex items-center justify-center shrink-0">
                {Icon && <Icon size={14} className={danger ? 'text-red-500' : 'text-[var(--text-secondary)]'} />}
            </div>
            <span className="flex-1 text-left">{label}</span>
            {shortcut && <span className="text-[10px] text-[var(--text-secondary)] opacity-50 ml-4 font-mono">{shortcut}</span>}
        </button>
    );

    const Divider = () => <div className="h-px bg-[var(--border)] my-1 mx-1" />;

    return (
        <div
            ref={menuRef}
            className="fixed z-[9999] bg-[var(--bg-panel)] border border-[var(--border)] rounded shadow-2xl py-1 min-w-[200px] backdrop-blur-md animate-in fade-in zoom-in-95 duration-75 select-none"
            style={style}
            onContextMenu={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
        >
            {type === 'tab' && (
                <>
                    <MenuItem icon={Scissors} label="Close" action="close" shortcut="Ctrl+W" />
                    <MenuItem label="Close Others" action="closeOthers" />
                    <MenuItem label="Close All" action="closeAll" />
                    <Divider />
                    <MenuItem icon={Copy} label="Copy Path" action="copyPath" shortcut="Alt+Shift+C" />
                </>
            )}

            {(type === 'explorer-file' || type === 'explorer-folder') && (
                <>
                    <MenuItem icon={FilePlus} label="New File..." action="newFile" />
                    <MenuItem icon={FolderPlus} label="New Folder..." action="newFolder" />
                    <Divider />
                    <MenuItem icon={Scissors} label="Cut" action="cut" shortcut="Ctrl+X" />
                    <MenuItem icon={Copy} label="Copy" action="copy" shortcut="Ctrl+C" />
                    <MenuItem icon={Clipboard} label="Paste" action="paste" shortcut="Ctrl+V" />
                    <Divider />
                    <MenuItem icon={Copy} label="Copy Path" action="copyPath" shortcut="Alt+Shift+C" />
                    <Divider />
                    <MenuItem icon={Edit2} label="Rename..." action="rename" shortcut="F2" />
                    <MenuItem icon={Trash2} label="Delete" action="delete" shortcut="Del" danger />
                </>
            )}

            {type === 'editor' && (
                <>
                    <MenuItem icon={Edit2} label="Format Document" action="format" shortcut="Shift+Alt+F" />
                    <Divider />
                    <MenuItem icon={Scissors} label="Cut" action="cut" shortcut="Ctrl+X" />
                    <MenuItem icon={Copy} label="Copy" action="copy" shortcut="Ctrl+C" />
                    <MenuItem icon={Clipboard} label="Paste" action="paste" shortcut="Ctrl+V" />
                </>
            )}
        </div>
    );
};
