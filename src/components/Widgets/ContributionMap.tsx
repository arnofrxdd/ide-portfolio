import React, { useRef, useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { THEMES } from '../../data/themes';
import FONT_5x7 from '../../data/font5x7';

// Legend Component using current theme colors
const LegendBox = ({ opacity, label, theme }: { opacity: number, label: string, theme: string }) => {
    // @ts-ignore
    const activeTheme = THEMES[theme] || THEMES.default;
    const colors = {
        // @ts-ignore
        border: activeTheme.colors['--border'],
        // @ts-ignore
        accent: activeTheme.colors['--accent']
    };

    const bgStyle = opacity === 0
        ? { backgroundColor: colors.border, opacity: 0.4 }
        : { backgroundColor: colors.accent, opacity: opacity };

    return (
        <div
            style={{ width: 10, height: 10, borderRadius: 2, ...bgStyle }}
            className="inline-block"
            title={label}
        />
    );
};

export const CanvasContributionMap = ({ theme }: { theme: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [wordIndex, setWordIndex] = useState(0);
    const [contributionCount, setContributionCount] = useState(0);

    const wordIndexRef = useRef(0);
    const frameRef = useRef<number | null>(null);

    const WORDS = ["HELLO", "BUILDER", "SYSTEMS", "REACT", "NETWORK"];
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Cycle through words
    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex(prev => (prev + 1) % WORDS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [WORDS.length]);

    useEffect(() => {
        wordIndexRef.current = wordIndex;
    }, [wordIndex]);

    // Persistent random noise background
    const randomMap = useMemo(() => {
        return Array.from({ length: 50 * 7 }).map(() => Math.random() > 0.92);
    }, []);

    // --- THEME ADAPTER ---
    // This pulls the actual colors defined in your THEMES config
    const getThemeColors = useCallback(() => {
        // @ts-ignore
        const activeTheme = THEMES[theme] || THEMES.default;
        return {
            bg: activeTheme.colors['--bg-activity'],
            border: activeTheme.colors['--border'],
            accent: activeTheme.colors['--accent'],
            textSecondary: activeTheme.colors['--text-secondary'],
            success: activeTheme.colors['--success'] || activeTheme.colors['--accent']
        };
    }, [theme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const COLS = 50;
        const ROWS = 7;
        const GAP = 3;
        const MIN_BLOCK_SIZE = 10;
        const LEFT_OFFSET = 32;
        const TOP_OFFSET = 24;
        const PADDING = 10;

        let currentBlockSize = MIN_BLOCK_SIZE;

        const updateDimensions = () => {
            const rect = container.getBoundingClientRect();
            const availableWidth = rect.width - (PADDING * 2) - LEFT_OFFSET;
            const totalGapSpace = (COLS - 1) * GAP;

            let size = Math.floor((availableWidth - totalGapSpace) / COLS);
            size = Math.max(size, MIN_BLOCK_SIZE);
            currentBlockSize = size;

            const totalWidth = PADDING * 2 + LEFT_OFFSET + COLS * (size + GAP) - GAP;
            const totalHeight = PADDING * 2 + TOP_OFFSET + ROWS * (size + GAP) - GAP;

            const dpr = window.devicePixelRatio || 1;
            canvas.width = totalWidth * dpr;
            canvas.height = totalHeight * dpr;
            canvas.style.width = `${totalWidth}px`;
            canvas.style.height = `${totalHeight}px`;
            ctx.scale(dpr, dpr);
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        const ANIMATION_DURATION = 800;
        let startTime: number | null = null;
        let lastRenderedWordIndex = wordIndexRef.current;
        let lastPrevWordIndex = wordIndexRef.current === 0 ? WORDS.length - 1 : wordIndexRef.current - 1;

        const checkGrid = (word: string, c: number, r: number) => {
            const LETTER_WIDTH = 5;
            const LETTER_GAP = 1;
            const letterIndex = Math.floor((c - 2) / (LETTER_WIDTH + LETTER_GAP));
            const localCol = (c - 2) % (LETTER_WIDTH + LETTER_GAP);
            if (localCol < LETTER_WIDTH && letterIndex >= 0 && letterIndex < word.length) {
                const char = word[letterIndex];
                // @ts-ignore
                const bitmap = FONT_5x7[char];
                return bitmap && bitmap[r] && bitmap[r][localCol] === "1";
            }
            return false;
        };

        const renderFrame = (timestamp: number) => {
            const currentWordIdx = wordIndexRef.current;
            const colors = getThemeColors();

            if (currentWordIdx !== lastRenderedWordIndex) {
                lastPrevWordIndex = lastRenderedWordIndex;
                lastRenderedWordIndex = currentWordIdx;
                startTime = timestamp;
            }

            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
            const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            const currentWord = WORDS[lastRenderedWordIndex];
            const prevWord = WORDS[lastPrevWordIndex];

            const totalW = canvas.width / (window.devicePixelRatio || 1);
            const totalH = canvas.height / (window.devicePixelRatio || 1);

            ctx.clearRect(0, 0, totalW, totalH);

            // --- DRAW LABELS ---
            ctx.font = "500 10px font-mono, monospace";
            // @ts-ignore
            ctx.fillStyle = colors.textSecondary;
            ctx.textBaseline = "middle";

            const days = ["", "Mon", "", "Wed", "", "Fri", ""];
            days.forEach((day, i) => {
                if (day) {
                    const y = PADDING + TOP_OFFSET + i * (currentBlockSize + GAP) + (currentBlockSize / 2);
                    ctx.fillText(day, PADDING, y);
                }
            });

            let currentMonthIndex = 0;
            for (let c = 0; c < COLS; c += 4.3) {
                if (currentMonthIndex < 12) {
                    const x = PADDING + LEFT_OFFSET + c * (currentBlockSize + GAP);
                    ctx.fillText(MONTHS[currentMonthIndex], x, PADDING + 8);
                    currentMonthIndex++;
                }
            }

            // --- DRAW GRID ---
            let activeBlocks = 0;

            for (let c = 0; c < COLS; c++) {
                for (let r = 0; r < ROWS; r++) {
                    const x = PADDING + LEFT_OFFSET + c * (currentBlockSize + GAP);
                    const y = PADDING + TOP_OFFSET + r * (currentBlockSize + GAP);

                    const isPrev = checkGrid(prevWord, c, r);
                    const isNext = checkGrid(currentWord, c, r);
                    const isRandom = randomMap[r * COLS + c];

                    // Logic to make words POP based on your previous request
                    let alpha = 0.2;
                    if (isPrev && isNext) alpha = 1.0;
                    else if (isPrev && !isNext) alpha = 1.0 - (ease * 0.82);
                    else if (!isPrev && isNext) alpha = 0.2 + (ease * 0.8);
                    else if (isRandom) alpha = 0.35;

                    if (alpha > 0.3) activeBlocks++;

                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.beginPath();

                    // THEME AWARE SHAPES
                    if (theme === 'monokai' || theme === 'solarizedDark' || theme === 'highContrast') {
                        ctx.rect(x, y, currentBlockSize, currentBlockSize);
                    } else if (theme === 'dracula' || theme === 'synthwave') {
                        ctx.arc(x + currentBlockSize / 2, y + currentBlockSize / 2, currentBlockSize / 2, 0, Math.PI * 2);
                    } else {
                        ctx.roundRect(x, y, currentBlockSize, currentBlockSize, 2);
                    }

                    // THEME AWARE COLORS & GLOW
                    if ((isPrev || isNext) && alpha > 0.3) {
                        // @ts-ignore
                        ctx.fillStyle = colors.accent;
                        if (theme === 'synthwave' || theme === 'dracula') {
                            // @ts-ignore
                            ctx.shadowColor = colors.accent;
                            ctx.shadowBlur = 12 * alpha;
                        }
                    } else if (isRandom) {
                        // @ts-ignore
                        ctx.fillStyle = colors.accent;
                    } else {
                        // @ts-ignore
                        ctx.fillStyle = colors.border;
                    }

                    ctx.fill();
                    ctx.restore();
                }
            }

            setContributionCount(activeBlocks);
            frameRef.current = requestAnimationFrame(renderFrame);
        };

        frameRef.current = requestAnimationFrame(renderFrame);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [theme, randomMap, getThemeColors]);

    return (
        <div className="mb-12 border border-[var(--border)] rounded-md bg-[var(--bg-activity)] p-5 max-w-full inline-block transition-colors duration-300">
            <div className="flex justify-between items-end mb-4 w-full">
                <h2 className="text-sm md:text-base text-[var(--text-primary)] font-mono font-medium">
                    {contributionCount} contributions in the last year
                </h2>
            </div>

            <div ref={containerRef} className="w-full overflow-x-auto custom-scrollbar">
                <canvas ref={canvasRef} className="block" />
            </div>

            <div className="flex justify-between items-center mt-4 text-[10px] md:text-xs text-[var(--text-secondary)] font-mono w-full">
                <div className="hidden sm:block opacity-50">
                    LEARN_MORE: [CONTRIBUTIONS_ALGORITHM]
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                    <span className="mr-1">Less</span>
                    <LegendBox opacity={0} label="0" theme={theme} />
                    <LegendBox opacity={0.45} label="1-3" theme={theme} />
                    <LegendBox opacity={0.6} label="4-9" theme={theme} />
                    <LegendBox opacity={1.0} label="10+" theme={theme} />
                    <span className="ml-1">More</span>
                </div>
            </div>
        </div>
    );
};
