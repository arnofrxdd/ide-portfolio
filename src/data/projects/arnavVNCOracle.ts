export const arnavVNCOracle = {
    id: "arnav_vnc_oracle",
    title: "ArnavVNC Remote Desktop",
    subtitle: "Browser-Based noVNC Deployment on Oracle Cloud",
    description:
        "A lightweight, browser-accessible remote desktop environment deployed on Oracle Cloud using noVNC, providing secure graphical access to a cloud VM without native RDP or VNC clients.",
    longDescription: `
ArnavVNC is a cloud-hosted remote desktop setup built using noVNC, enabling full graphical access to an Oracle Cloud virtual machine directly from any modern web browser.

The system exposes a VNC session through a WebSocket-based noVNC frontend, eliminating the need for traditional VNC or RDP clients. This allows access from laptops, tablets, and even mobile devices while maintaining a consistent desktop experience.

The deployment focuses on simplicity, portability, and reliability, using a headless Linux desktop environment paired with a VNC server and a noVNC web gateway. The setup is ideal for remote development, system administration, and lightweight GUI-based workflows on cloud infrastructure.

This project demonstrates practical experience with cloud VM provisioning, remote desktop protocols, WebSocket tunneling, and browser-based tooling for infrastructure access.
`,
    type: "Infrastructure / Cloud Access",
    tech: [
        "Oracle Cloud Infrastructure",
        "noVNC",
        "VNC Server",
        "WebSockets",
        "Linux Desktop Environment",
        "Remote Desktop",
        "Cloud VM Management"
    ],
    links: {
        github: "https://github.com/arnofrxdd/arnav-vnc-oracle"
    },
    image:
        "https://raw.githubusercontent.com/arnofrxdd/portfolio/main/Screenshot%202026-01-12%20010153.png",

    imageStyle: {
        maxWidth: "700px",
        maxHeight: "600px",
        objectFit: "contain"
    },

    date: "2026",
    role: "Cloud Infrastructure Engineer",
    highlights: [
        "Browser-based remote desktop access using noVNC",
        "Oracle Cloud VM deployment with graphical desktop environment",
        "WebSocket-based VNC proxy for clientless access",
        "No dependency on native RDP or VNC clients",
        "Accessible from desktop, tablet, and mobile browsers",
        "Lightweight and low-latency remote GUI experience",
        "Ideal for remote development and system administration",
        "Minimal setup with strong portability across devices"
    ],
    featured: false,
    languages: [
        { name: "Shell", percent: 60, color: "#4ade80" },
        { name: "HTML", percent: 20, color: "#e34c26" },
        { name: "JavaScript", percent: 20, color: "#f7df1e" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "Initial Oracle Cloud deployment with noVNC web-based remote desktop",
            time: "Latest",
            status: "success"
        }
    ],
    snippet: `# noVNC WebSocket gateway
./novnc/utils/launch.sh --vnc localhost:5901 --listen 6080

# VNC server running on the VM
Xtigervnc :1 -geometry 1280x720 -depth 24
`,
    architecture: `
[Browser (Client)]
        |
        v
[noVNC Web UI]
        |
        v
[WebSocket Proxy]
        |
        v
[VNC Server :5901]
        |
        v
+------------------------------------+
| Oracle Cloud VM                    |
|  - Linux Desktop Environment       |
|  - VNC Server                      |
|  - noVNC Gateway                   |
+------------------------------------+
`
};
