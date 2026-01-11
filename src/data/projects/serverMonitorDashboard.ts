export const serverMonitorDashboard = {
    id: "server_monitor_dashboard",
    title: "Server Monitor Dashboard",
    subtitle: "Real-Time System Monitoring & Process Manager",
    description:
        "A lightweight, real-time server monitoring dashboard built with Node.js and Express, providing live CPU, memory, disk, load, and process management through a clean browser-based UI.",
    longDescription: `
Server Monitor Dashboard is a self-hosted system monitoring application designed to provide real-time visibility into server performance and running processes through a web interface.

The backend is built using Node.js and Express, leveraging native OS APIs and shell utilities to collect detailed system metrics such as CPU usage per core, memory consumption, disk utilization, system load averages, network interfaces, uptime, and process statistics.

The frontend is delivered directly by the server and renders a responsive dashboard featuring live graphs, per-core CPU usage, historical trend visualization, and an interactive process manager. Users can inspect processes in detail, sort them by CPU or memory usage, and terminate misbehaving processes directly from the UI.

Historical metrics are retained in memory to enable smooth real-time graphing, making the dashboard suitable for lightweight monitoring, debugging, and administrative oversight on cloud or bare-metal servers.
`,
    type: "Backend + System Tooling",
    tech: [
        "Node.js",
        "Express",
        "OS Module",
        "Child Processes",
        "Chart.js",
        "HTML/CSS",
        "System Monitoring",
        "Process Management"
    ],
    links: {
        github: "https://github.com/arnofrxdd/server-monitor-dashboard"
    },
    image:
        "https://raw.githubusercontent.com/arnofrxdd/portfolio/main/Screenshot%202026-01-12%20010840.png",

    imageStyle: {
        maxWidth: "700px",
        maxHeight: "600px",
        objectFit: "contain"
    },

    date: "2026",
    role: "Backend & Systems Developer",
    highlights: [
        "Real-time CPU usage tracking with per-core breakdown",
        "Memory usage monitoring with historical graphing",
        "Disk usage and system load visualization",
        "Live process listing with CPU and memory sorting",
        "In-browser process inspection with detailed metadata",
        "Remote process termination via secure API endpoint",
        "Historical metric storage for smooth real-time graphs",
        "Zero external dependencies for system metrics collection"
    ],
    featured: false,
    languages: [
        { name: "JavaScript", percent: 85, color: "#f7df1e" },
        { name: "HTML/CSS", percent: 15, color: "#e34c26" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "Initial release with real-time metrics, graphs, and process manager",
            time: "Latest",
            status: "success"
        }
    ],
    snippet: `// CPU usage calculation (per core)
const perCore = nowCPU.map((cpu, i) => {
  const idleDiff = cpu.idle - lastCPU[i].idle;
  const totalDiff = cpu.total - lastCPU[i].total;
  return Math.round(100 - (100 * idleDiff / totalDiff));
});

// Kill process endpoint
app.post("/kill/:pid", (req, res) => {
  exec(\`kill -9 \${pid}\`);
});
`,
    architecture: `
[Browser UI]
        |
        v
[Express Server]
        |
        +--> OS Metrics (os module)
        |
        +--> Process Stats (ps, df, uptime)
        |
        +--> Historical In-Memory Store
        |
        v
[JSON API (/stats, /processes)]
        |
        v
[Chart.js Visualization + Process Manager UI]
`
};
