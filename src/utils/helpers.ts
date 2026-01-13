export const getTechColorStyles = (tech: string) => {
    const map: Record<string, string> = {
        "React": "text-cyan-400 border-cyan-400/30 bg-cyan-950/30",
        "Vue": "text-emerald-400 border-emerald-400/30 bg-emerald-950/30",
        "Next.js": "text-slate-200 border-slate-400/30 bg-slate-900/40",
        "Tailwind": "text-cyan-300 border-cyan-400/30 bg-cyan-950/20",
        "HTML": "text-orange-400 border-orange-400/30 bg-orange-950/30",
        "CSS": "text-blue-300 border-blue-400/30 bg-blue-950/30",
        "Chart.js": "text-pink-400 border-pink-400/30 bg-pink-950/30",
        "Node.js": "text-green-500 border-green-500/30 bg-green-950/30",
        "Express": "text-lime-400 border-lime-400/30 bg-lime-950/30",
        "TypeScript": "text-blue-400 border-blue-400/30 bg-blue-950/30",
        "Python": "text-yellow-400 border-yellow-400/30 bg-yellow-950/30",
        "Go": "text-sky-400 border-sky-400/30 bg-sky-950/30",
        "Java": "text-red-400 border-red-400/30 bg-red-950/30",
        "MongoDB": "text-green-400 border-green-400/30 bg-green-950/30",
        "PostgreSQL": "text-indigo-400 border-indigo-400/30 bg-indigo-950/30",
        "MySQL": "text-blue-400 border-blue-400/30 bg-blue-950/30",
        "Redis": "text-red-400 border-red-400/30 bg-red-950/30",
        "Git": "text-orange-400 border-orange-400/30 bg-orange-950/30",
        "GitHub": "text-slate-200 border-slate-400/30 bg-slate-800/40",
        "Linux": "text-yellow-300 border-yellow-400/30 bg-yellow-950/20",
        "Docker": "text-sky-400 border-sky-400/30 bg-sky-950/30",
    };
    return map[tech] || "text-slate-300 border-slate-600/30 bg-slate-800/30";
};
