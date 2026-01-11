export const sailPowerMonitoring = {
    id: "sail_power_monitoring",
    title: "PowerGrid Analytics",
    subtitle: "Reverse-Engineered Industrial Power Analytics Dashboard",
    description:
        "A full-stack industrial monitoring platform built by reverse-engineering a proprietary Android application to extract real-time power generation, frequency, and consumption data.",

    longDescription: `
PowerGrid Analytics is a full-stack industrial analytics platform built by reverse-engineering a closed-source, proprietary Android application used inside a Steel Authority of India (SAIL) plant.

The original system exposed no public APIs or documentation and was accessible only through a restricted Android app. By analyzing Android network traffic, request payloads, headers, polling intervals, and response structures, I reconstructed the backend communication layer and built a standalone Node.js service to fetch plant telemetry directly.

The backend continuously polls undocumented endpoints, normalizes raw plant data, persists it as a time-series Excel log, and exposes a secure, authenticated web dashboard for real-time and historical analysis.

This project demonstrates real-world reverse engineering, protocol reconstruction, industrial data visualization, and reliable backend system design under undocumented constraints.
`,

    type: "Full-Stack System (Reverse Engineering)",
    tech: [
        "Node.js",
        "Express.js",
        "Reverse Engineering",
        "Android Network Analysis",
        "Axios",
        "Chart.js",
        "chartjs-plugin-zoom",
        "Excel (XLSX)",
        "Session-Based Auth",
        "Industrial Dashboards"
    ],

    links: {
        github: "https://github.com/arnofrxdd/sail-power-monitoring"
    },

    image:
        "https://raw.githubusercontent.com/arnofrxdd/portfolio/main/Screenshot%202026-01-12%20002642.png",

    imageStyle: {
        maxWidth: "900px",
        maxHeight: "600px",
        objectFit: "contain"
    },

    date: "2026",
    role: "Reverse Engineer & Full-Stack Developer",

    highlights: [
        "Reverse-engineered a proprietary Android app with no public API",
        "Reconstructed undocumented backend endpoints and payload formats",
        "Emulated Android client headers and polling behavior",
        "Built a standalone Node.js backend to fetch live plant telemetry",
        "Logged high-frequency industrial data into Excel time-series storage",
        "Secure session-based dashboard with authentication",
        "Real-time power generation, frequency, and township consumption tracking",
        "Interactive charts with zoom, pan, and historical auto-loading",
        "Alarm-time detection with visual and audio alerts",
        "Industrial dark-mode dashboard optimized for control rooms"
    ],

    featured: false,

    languages: [
        { name: "JavaScript", percent: 80, color: "#f7df1e" },
        { name: "HTML/CSS", percent: 15, color: "#e34f26" },
        { name: "Excel/XLSX", percent: 5, color: "#1d6f42" }
    ],

    deployHistory: [
        {
            version: "v1.0",
            msg: "Reverse-engineered Android backend and live data ingestion",
            time: "Initial",
            status: "success"
        },
        {
            version: "v2.0",
            msg: "Interactive dashboard with charts, zoom, alarms, and pagination",
            time: "Latest",
            status: "success"
        }
    ],

    snippet: `// Reverse-engineered Android API request
const API_URL = "http://plantstatus.sailrsp.co.in/ppc_data.asmx/opn_data";

await axios.post(
  API_URL,
  "opn_data_code=POWER_GEN_PRODN_STAT",
  {
    headers: {
      "User-Agent": "Dalvik/2.1.0 (Linux; Android)",
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "gzip"
    },
    timeout: 8000
  }
);
`,

    architecture: `
[Proprietary Android App]
        |
        | (reverse-engineered network protocol)
        v
[Undocumented Plant Backend]
        |
        v
[Node.js / Express Backend]
        |
        +--> Live Polling (Power & Frequency)
        +--> Excel Time-Series Logger
        |
        v
[Authenticated Web Dashboard]
        |
        +--> Real-Time Tables
        +--> Interactive Charts (Zoom / Pan)
        +--> Alarm Detection
        +--> Historical Data Explorer
`
};
