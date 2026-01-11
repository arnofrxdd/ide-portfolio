export const sailPowerBot = {
    id: "sail-power-bot",
    title: "SAIL Telegram Bot",
    subtitle: "Industrial Power Monitoring Bot with Admin Dashboard",
    description:
        "A production-grade Telegram bot for real-time and historical power monitoring with chart generation, access control, and a secure admin panel.",
    longDescription: `
SAIL Power Bot is a full-featured Telegram bot designed for monitoring industrial power plant data in real time. It fetches live and historical power statistics from a remote API, processes and stores time-series data in Excel format, and exposes rich insights to users through interactive Telegram commands and buttons.

The bot supports live data, unit-wise generation and frequency stats, historical queries with flexible date/time parsing, and dynamic trend charts generated on demand using Chart.js. A multi-step conversational flow allows users to request precise historical windows and receive visual trend graphs directly inside Telegram.

Access control is enforced via an approval-based registration system. Users must request access, which is managed through a secure web-based admin panel built with Express. Admins can approve or revoke users, monitor bot status, and broadcast messages to all approved users in real time.

The system is designed for reliability, handling malformed input, network failures, and time-zone correctness (IST), while maintaining a clean UX across both Telegram and the admin dashboard.
`,
    type: "Automation / Monitoring Tool",
    tech: [
        "Node.js",
        "Telegram Bot API",
        "Express.js",
        "Axios",
        "Chart.js",
        "chartjs-node-canvas",
        "Excel (XLSX)",
        "JWT-style Session Handling",
        "HTML/CSS (Admin Panel)"
    ],
    links: {
        github: "https://github.com/arnofrxdd/portfolio"
    },
    image:
        "https://raw.githubusercontent.com/arnofrxdd/portfolio/main/WhatsApp%20Image%202026-01-11%20at%2023.54.04.jpeg",

    imageStyle: {
        maxWidth: "320px",
        maxHeight: "800px",
        objectFit: "contain"
    },

    date: "2026",
    role: "Backend Developer & System Designer",
    highlights: [
        "Real-time power plant data monitoring via Telegram",
        "Historical data queries with flexible date/time parsing",
        "On-demand trend chart generation (Generation, Frequency, Town Power)",
        "Excel-based time-series data storage",
        "Approval-based user access control",
        "Secure web-based admin panel",
        "Broadcast messaging to approved users",
        "Robust error handling and input validation"
    ],
    featured: false,
    languages: [
        { name: "JavaScript", percent: 70, color: "#f7df1e" },
        { name: "Node.js", percent: 20, color: "#3c873a" },
        { name: "HTML/CSS", percent: 10, color: "#38bdf8" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "Initial deployment with live data, historical queries, and admin panel",
            time: "Latest",
            status: "success"
        }
    ],
    snippet: `// Generate trend chart and send to Telegram
const rows = getRowsBetweenDateTime(date, fromTime, toTime);

const image = await generateTrendChart(
    rows,
    \`Power Trend \${date} (\${fromTime} - \${toTime})\`,
    chartType
);

await bot.sendPhoto(chatId, image);
`,
    architecture: `
[ Telegram Client ]
        |
        v
[ Telegram Bot API ]
        |
        v
+----------------------------------+
|        Node.js Bot Server         |
|  - Command parsing               |
|  - User approval logic           |
|  - Data formatting               |
|  - Chart generation              |
+----------------------------------+
        |
        +--> External Power API
        |
        +--> Excel (XLSX) Data Store
        |
        v
+----------------------------------+
|        Express Admin Panel        |
|  - Admin authentication          |
|  - User approvals                |
|  - Bot status & metrics           |
|  - Broadcast messaging           |
+----------------------------------+
`
};
