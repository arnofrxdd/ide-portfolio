import { useState, useRef, useEffect } from 'react';
import { Terminal, Minimize2, X } from 'lucide-react';
import { PROJECTS_DATA } from '../../data/projects';
import { generateGeminiResponse } from '../../services/gemini';

interface TerminalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenFile: (file: any) => void;
}

export const IntegratedTerminal = ({ isOpen, onClose, onOpenFile }: TerminalProps) => {
    const [history, setHistory] = useState([
        { type: 'system', content: 'Shell v2.5.0' },
        { type: 'system', content: 'Type "help" for commands or just ask a question.' },
    ]);
    const [input, setInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [history]);

    useEffect(() => {
        if (!isProcessing && isOpen) {
            const t = setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
            return () => clearTimeout(t);
        }
    }, [isProcessing, isOpen]);

    const handleCommand = async () => {
        const cmd = input.trim();
        if (!cmd) return;

        setHistory(prev => [...prev, { type: 'user', content: cmd }]);
        setInput("");

        const args = cmd.split(' ');
        const command = args[0].toLowerCase();

        if (command === 'help') {
            setTimeout(() => {
                setHistory(prev => [...prev, {
                    type: 'output', content:
                        `Available Commands:
  ls              List all projects
  open <name>     Open project details
  cat <name>       Print project summary
  clear            Clear terminal history
  whoami           Print current user info
  <query>          Ask Gemini AI anything`
                }]);
                setIsProcessing(false);
            }, 100);
            return;
        }

        if (command === 'ls' || command === 'list') {
            const list = PROJECTS_DATA.map(p =>
                `${p.id.padEnd(20)} ${p.type.padEnd(15)} ${p.date}`
            ).join('\n');

            setTimeout(() => {
                setHistory(prev => [...prev, { type: 'output', content: list }]);
                setIsProcessing(false);
            }, 100);
            return;
        }

        if (command === 'clear') {
            setHistory([]);
            setIsProcessing(false);
            return;
        }

        if (command === 'open') {
            const target = args[1];
            const project = PROJECTS_DATA.find(p => p.id === target || p.title === target);
            if (project) {
                setHistory(prev => [...prev, { type: 'success', content: `Opening ${project.title}...` }]);
                onOpenFile({ id: project.id, title: `${project.title}.tsx`, type: 'detail', data: project });
            } else {
                setHistory(prev => [...prev, { type: 'error', content: `Error: Project '${target}' not found.` }]);
            }
            setIsProcessing(false);
            return;
        }

        if (command === 'cat') {
            const target = args[1];
            const project = PROJECTS_DATA.find(p => p.id === target || p.title === target);
            if (project) {
                setHistory(prev => [...prev, { type: 'output', content: `\n--- ${project.title.toUpperCase()} ---\n${project.description}\nStack: ${project.tech.join(', ')}\n` }]);
            } else {
                setHistory(prev => [...prev, { type: 'error', content: `Error: Project '${target}' not found.` }]);
            }
            setIsProcessing(false);
            return;
        }

        try {
            setIsProcessing(true);
            const thinkingId = Date.now();
            // @ts-ignore
            setHistory(prev => [
                ...prev,
                { id: thinkingId, type: 'system', content: 'gemini: thinking' }
            ]);

            let frame = 0;
            const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

            const thinkingInterval = setInterval(() => {
                frame = (frame + 1) % frames.length;
                setHistory(prev =>
                    prev.map(line =>
                        // @ts-ignore
                        line.id === thinkingId
                            ? { ...line, content: `gemini: ${frames[frame]} thinking` }
                            : line
                    )
                );
            }, 120);

            const aiResponse = await generateGeminiResponse(cmd);
            const delay = 800 + Math.random() * 800;

            setTimeout(() => {
                clearInterval(thinkingInterval);
                setHistory(prev => [
                    // @ts-ignore
                    ...prev.filter(line => line.id !== thinkingId),
                    { type: 'output', content: aiResponse }
                ]);
                setIsProcessing(false);
            }, delay);
            return;
        } catch (e) {
            setHistory(prev => [...prev, { type: 'error', content: "Error connecting to AI." }]);
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="relative h-64 bg-[var(--bg-main)] border-t border-[var(--border)] z-20 flex flex-col transition-all duration-300">
            <div className="h-8 bg-[var(--bg-activity)] border-b border-[var(--border)] flex justify-between items-center px-4 select-none flex-shrink-0">
                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-mono">
                    <Terminal size={12} />
                    <span>TERMINAL</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] text-[var(--text-secondary)] font-mono hidden md:inline">Node v20.1.0</span>
                    <button onClick={onClose} className="hover:text-[var(--text-primary)] text-[var(--text-secondary)] transition-colors">
                        <Minimize2 size={14} />
                    </button>
                    <button onClick={onClose} className="hover:text-red-400 text-[var(--text-secondary)] transition-colors">
                        <X size={14} />
                    </button>
                </div>
            </div>
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-xs md:text-sm bg-[var(--bg-main)] custom-scrollbar"
                onClick={() => {
                    if (!isProcessing) inputRef.current?.focus();
                }}
            >
                {history.map((line, i) => (
                    <div key={i} className="mb-1 whitespace-pre-wrap break-words">
                        {line.type === 'user' && (
                            <div className="flex gap-2 text-[var(--text-primary)]">
                                <span className="text-[var(--success)]">➜</span>
                                <span className="text-[var(--info)]">~</span>
                                <span>{line.content}</span>
                            </div>
                        )}
                        {line.type === 'system' && <div className="text-[var(--text-secondary)] italic">{line.content}</div>}
                        {line.type === 'output' && <div className="text-[var(--text-primary)] ml-4">{line.content}</div>}
                        {line.type === 'success' && <div className="text-[var(--success)] ml-4">{line.content}</div>}
                        {line.type === 'error' && <div className="text-red-400 ml-4">{line.content}</div>}
                    </div>
                ))}
                <div className="flex gap-2 items-center mt-2">
                    <span className="text-[var(--success)]">➜</span>
                    <span className="text-[var(--info)]">~</span>
                    <div className="relative flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            disabled={isProcessing}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !isProcessing) {
                                    e.preventDefault();
                                    handleCommand();
                                }
                            }}
                            className={`w-full bg-transparent border-none outline-none ${isProcessing ? 'text-[var(--text-secondary)] cursor-wait' : 'text-[var(--text-primary)]'}`}
                        />
                        {isProcessing && (
                            <div className="absolute top-0 right-0">
                                <div className="h-4 w-2 bg-[var(--text-secondary)] animate-pulse" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
