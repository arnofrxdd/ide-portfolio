import React, { useRef, useState, useEffect } from 'react';

interface RealMinimapProps {
    content: string;
    editorRef: React.RefObject<HTMLDivElement>;
}

export const RealMinimap = ({ content, editorRef }: RealMinimapProps) => {
    const minimapRef = useRef<HTMLDivElement>(null);
    const codeContentRef = useRef<HTMLDivElement>(null);
    const [viewport, setViewport] = useState({ top: 0, height: 0 });
    const isDragging = useRef(false);

    // Track the max travel distance for drag calculations
    const scrollTrackMaxRef = useRef(0);

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor) return;

        const updateMap = () => {
            if (!minimapRef.current || !codeContentRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } = editor;
            const mapHeight = minimapRef.current.clientHeight;
            const miniCodeHeight = codeContentRef.current.scrollHeight;

            if (mapHeight === 0 || miniCodeHeight === 0) return;

            // 1. Calculate Slider Height (Proportional)
            // Ratio: visible_code / total_code = slider_height / total_mini_code
            let sliderHeight = (clientHeight / scrollHeight) * miniCodeHeight;

            // Clamp slider height to be usable
            const MIN_SLIDER_HEIGHT = 20;
            sliderHeight = Math.max(MIN_SLIDER_HEIGHT, sliderHeight);

            // If code fits entirely in view, slider is full height of mini representation
            if (scrollHeight <= clientHeight) {
                sliderHeight = miniCodeHeight;
            }

            // 2. Calculate Scroll Percentage
            const maxScrollTop = scrollHeight - clientHeight;
            const scrollPercent = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
            const safePercent = Math.max(0, Math.min(1, scrollPercent));

            let sliderTop = 0;
            let mapTranslateY = 0;

            // --- LOGIC FORK: BIG FILES VS SMALL FILES ---

            // CASE 1: Small/Medium File (Minimap representation fits inside container)
            // The code in minimap does NOT scroll. The slider moves over it.
            if (miniCodeHeight <= mapHeight) {
                mapTranslateY = 0;

                // Slider travels from 0 to (miniCodeHeight - sliderHeight)
                const maxSliderTop = Math.max(0, miniCodeHeight - sliderHeight);
                sliderTop = safePercent * maxSliderTop;

                scrollTrackMaxRef.current = maxSliderTop;
            }
            // CASE 2: Big File (Minimap representation is taller than container)
            // The slider stays relatively static/proportional while content scrolls underneath
            else {
                // Slider travels from 0 to (mapHeight - sliderHeight)
                const maxSliderMove = mapHeight - sliderHeight;
                sliderTop = safePercent * maxSliderMove;

                // Content scrolls from 0 to (miniCodeHeight - mapHeight)
                const maxContentScroll = miniCodeHeight - mapHeight;
                mapTranslateY = safePercent * maxContentScroll;

                scrollTrackMaxRef.current = maxSliderMove;
            }

            setViewport({ top: sliderTop, height: sliderHeight });

            if (codeContentRef.current) {
                codeContentRef.current.style.transform = `translateY(-${mapTranslateY}px)`;
            }
        };

        // Attach listeners
        editor.addEventListener('scroll', updateMap);
        const observer = new ResizeObserver(updateMap);
        observer.observe(editor);
        // @ts-ignore
        observer.observe(minimapRef.current); // Watch minimap resize too

        // Initial update
        requestAnimationFrame(updateMap);

        return () => {
            editor.removeEventListener('scroll', updateMap);
            observer.disconnect();
        };
    }, [editorRef, content]);

    const teleport = (e: React.MouseEvent) => {
        const editor = editorRef.current;
        if (!editor || !minimapRef.current || !codeContentRef.current) return;

        const minimapRect = minimapRef.current.getBoundingClientRect();
        const clickY = e.clientY - minimapRect.top;

        const miniContentHeight = codeContentRef.current.scrollHeight;
        const editorScrollHeight = editor.scrollHeight;
        const editorClientHeight = editor.clientHeight;

        // Clamp click inside minimap
        const clampedY = Math.max(0, Math.min(clickY, minimapRect.height));

        // Convert click position → percentage of minimap content
        const percent = miniContentHeight <= minimapRect.height
            ? clampedY / miniContentHeight
            : (clampedY + Math.abs(
                parseFloat(
                    codeContentRef.current.style.transform
                        ?.replace('translateY(', '')
                        ?.replace('px)', '') || '0'
                ))) / miniContentHeight;

        // Jump editor directly to that position
        editor.scrollTop = percent * (editorScrollHeight - editorClientHeight);
    };


    const handleMouseDown = (e: React.MouseEvent) => {
        // @ts-ignore
        const rect = minimapRef.current.getBoundingClientRect();
        const clickY = e.clientY - rect.top;

        // Check if clicked ON the slider
        const isSlider = clickY >= viewport.top && clickY <= viewport.top + viewport.height;

        if (!isSlider) {
            teleport(e);
        }

        isDragging.current = true;
    };

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!isDragging.current || !minimapRef.current) return;
            e.preventDefault();
            teleport(e as unknown as React.MouseEvent);
        };

        const handleUp = () => {
            isDragging.current = false;
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [viewport.height]); // Re-bind if viewport height changes significantly to keep logic fresh

    return (
        <div
            ref={minimapRef}
            onMouseDown={handleMouseDown}
            className="w-24 bg-[var(--bg-main)] border-l border-[var(--border)] relative hidden md:block select-none overflow-hidden shrink-0"
        >
            {/* Code Representation */}
            <div ref={codeContentRef} className="absolute top-0 left-0 w-full opacity-60 pointer-events-none p-1 transition-transform duration-75 will-change-transform">
                <div className="text-[2px] leading-[4px] text-[var(--text-secondary)] font-mono whitespace-pre-wrap break-all select-none">
                    {content}
                </div>
            </div>

            {/* Viewport Slider Overlay */}
            <div
                style={{ top: viewport.top, height: viewport.height }}
                className="absolute left-0 w-full bg-[var(--text-secondary)]/10 hover:bg-[var(--text-secondary)]/20 transition-colors border-y border-[var(--selection)] shadow-[0_0_10px_rgba(0,0,0,0.1)] backdrop-blur-[0.5px] cursor-grab active:cursor-grabbing"
            />
        </div>
    );
};
