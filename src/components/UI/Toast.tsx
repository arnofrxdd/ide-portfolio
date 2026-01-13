import React from 'react';
import { CheckCircle, AlertCircle, Bell } from 'lucide-react';

export interface Toast {
    id: number;
    msg: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

export const ToastContainer = ({ toasts }: { toasts: Toast[] }) => {
    return (
        <div className="fixed bottom-12 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className="min-w-[200px] max-w-sm bg-[var(--bg-panel)] border border-[var(--border)] border-l-4 p-3 rounded shadow-xl animate-in slide-in-from-right-full fade-in duration-300"
                    style={{
                        borderLeftColor:
                            toast.type === 'success' ? 'var(--success)' :
                                toast.type === 'error' ? '#ef4444' :
                                    toast.type === 'warning' ? 'var(--warning)' :
                                        'var(--info)'
                    }}
                >
                    <div className="flex items-center gap-2">
                        <span style={{
                            color: toast.type === 'success' ? 'var(--success)' :
                                toast.type === 'error' ? '#ef4444' :
                                    toast.type === 'warning' ? 'var(--warning)' :
                                        'var(--info)'
                        }}>
                            {toast.type === 'success' && <CheckCircle size={16} />}
                            {toast.type === 'error' && <AlertCircle size={16} />}
                            {toast.type === 'info' && <Bell size={16} />}
                        </span>
                        <span className="text-xs font-mono text-[var(--text-primary)]">{toast.msg}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
