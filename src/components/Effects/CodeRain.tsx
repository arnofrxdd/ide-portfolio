import React, { useRef, useEffect } from 'react';

export const CodeRainBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        const characters = '01';
        const fontSize = 14;
        const columns = width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 12, 0.05)';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#334155'; // Modified to be subtle in any theme, or could use var
            ctx.font = `${fontSize}px monospace`;
            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        };
        const interval = setInterval(draw, 50);
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);
        return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
    }, []);
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};
