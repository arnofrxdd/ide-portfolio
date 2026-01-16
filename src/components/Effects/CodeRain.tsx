import React, { useRef, useEffect } from 'react';

export const CodeRainBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let drops: number[] = [];

        const init = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            // DPI Scaling for mobile/Retina support
            const dpr = window.devicePixelRatio || 1;

            canvas.width = width * dpr;
            canvas.height = height * dpr;

            // Normalize coordinate system to logical pixels
            ctx.scale(dpr, dpr);

            const fontSize = 14;
            const columns = Math.ceil(width / fontSize);

            // Initialize drops if empty or resized excessively
            if (drops.length === 0 || Math.abs(drops.length - columns) > 5) {
                drops = Array(columns).fill(1).map(() => Math.floor(Math.random() * -50));
            }
        };

        init();

        const characters = '01';
        const fontSize = 14;

        const draw = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Semi-transparent fade effect for trail
            ctx.fillStyle = 'rgba(10, 10, 12, 0.05)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#334155'; // Theme-neutral dark slate
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const loop = () => {
            draw();
            // Cap at ~20 FPS for performance and "retro" feel
            setTimeout(() => {
                animationFrameId = requestAnimationFrame(loop);
            }, 50);
        };

        loop();

        const handleResize = () => {
            init();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-[var(--bg-main)]" />;
};
