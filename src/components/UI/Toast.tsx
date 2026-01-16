import { CheckCircle, AlertCircle, X, Info, AlertTriangle } from 'lucide-react';

export interface Toast {
    id: number;
    msg: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContainerProps {
    toasts: Toast[];
    onClose: (id: number) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
    return (
        <div className="fixed z-[9999] flex flex-col gap-3 pointer-events-none items-end bottom-4 right-4 left-4 md:left-auto md:bottom-10 md:right-4 w-auto md:w-full md:max-w-[420px] ml-auto">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className="group pointer-events-auto flex w-full bg-[var(--bg-panel)] backdrop-blur-md border border-[var(--border)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-in slide-in-from-right-12 fade-in duration-300 rounded-sm overflow-hidden ring-1 ring-white/5"
                >
                    {/* Status Indicator Bar */}
                    <div
                        className="w-1 shrink-0"
                        style={{
                            backgroundColor:
                                toast.type === 'success' ? '#388a34' :
                                    toast.type === 'error' ? '#f14c4c' :
                                        toast.type === 'warning' ? '#cca700' :
                                            '#3794ef'
                        }}
                    />

                    <div className="flex-1 flex flex-col p-3.5 pr-2">
                        <div className="flex items-start gap-3.5">
                            {/* Icon */}
                            <div className="mt-0.5 shrink-0" style={{
                                color: toast.type === 'success' ? '#388a34' :
                                    toast.type === 'error' ? '#f14c4c' :
                                        toast.type === 'warning' ? '#cca700' :
                                            '#3794ef'
                            }}>
                                {toast.type === 'success' && <CheckCircle size={20} strokeWidth={2} />}
                                {toast.type === 'error' && <AlertCircle size={20} strokeWidth={2} />}
                                {toast.type === 'warning' && <AlertTriangle size={20} strokeWidth={2} />}
                                {toast.type === 'info' && <Info size={20} strokeWidth={2} />}
                            </div>

                            {/* Message */}
                            <div className="flex-1 min-w-0">
                                <div className="text-[13px] text-[var(--text-primary)] leading-[1.4] whitespace-pre-wrap">
                                    {toast.msg}
                                </div>
                                <div className="mt-1.5 flex items-center gap-2">
                                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] opacity-50 font-bold">
                                        Source: Portfolio Intelligence
                                    </span>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => onClose(toast.id)}
                                className="p-1 hover:bg-white/10 rounded-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all opacity-0 group-hover:opacity-100"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
