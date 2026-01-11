export const netBridge = {

    id: "netbridge",
    title: "NetBridge",
    subtitle: "Stealth Network Tunnel with Xray Reality & Sing-box TUN",
    description:
        "A desktop tunneling client built with Electron that establishes a stealth system-wide network tunnel using Xray (VLESS + Reality) and Sing-box TUN, designed to bypass restrictive firewalls with minimal user interaction.",
    longDescription: `
NetBridge is a Windows desktop tunneling application that provides a secure, system-wide network tunnel using Xray Core with VLESS + Reality and a Sing-box TUN interface.

The application launches and orchestrates multiple low-level networking components from an Electron main process, dynamically generating and piping configuration data to Xray and Sing-box at runtime. Xray is used as a local proxy core, while Sing-box operates in TUN mode to route all eligible system traffic through the encrypted tunnel.

NetBridge performs active connectivity checks, latency probing, and traffic monitoring to verify tunnel health in real time. A minimal, distraction-free UI provides a single-toggle interaction model, while background services handle process supervision, statistics collection, and automatic cleanup on disconnect or failure.

The project is designed to remain lightweight, stealthy, and resilient under restrictive network environments, while maintaining real-time feedback through traffic graphs, latency metrics, and live connection logs.
`,
    type: "Desktop Tool",
    tech: [
        "Electron",
        "Node.js",
        "Xray Core",
        "VLESS + Reality",
        "Sing-box",
        "TUN Interface",
        "IPC",
        "Win32 Networking"
    ],
    links: {
        github: "https://github.com/arnofrxdd/NetBridge"
    },
    image:
        "https://raw.githubusercontent.com/arnofrxdd/NetBridge/main/Screenshot%202026-01-08%20211621.png",

    imageStyle: {
        maxWidth: "280px",
        maxHeight: "800px",
        objectFit: "contain"
    },

    date: "2026",
    role: "Creator & Lead Developer",
    highlights: [
        "System-wide tunneling via Sing-box TUN",
        "Stealth proxy core using Xray VLESS + Reality",
        "Dynamic runtime configuration injection",
        "Electron-based desktop client with tray control",
        "Real-time traffic, speed, and latency monitoring",
        "Automatic connectivity verification and recovery",
        "Single-click connect / disconnect workflow",
        "Firewall and network restriction bypass design"
    ],
    featured: true,
    languages: [
        { name: "JavaScript", percent: 60, color: "#f7df1e" },
        { name: "JSON", percent: 20, color: "#6b7280" },
        { name: "HTML/CSS", percent: 20, color: "#38bdf8" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "Initial release with Xray Reality + Sing-box TUN integration",
            time: "Latest",
            status: "success"
        }
    ],
    snippet: `// NetBridge core tunnel orchestration flow
async function connectNetBridge() {
    // Spawn Xray with VLESS + Reality configuration
    xray = spawnXrayWithConfig(xrayConfig);

    // Start Sing-box in TUN mode and route system traffic
    singbox = spawnSingBoxTun(singboxConfig);

    // Verify external connectivity
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        if (await checkInternetConnectivity()) {
            startTrafficStats();
            notifyUIConnected();
            return true;
        }
        await delay(RETRY_DELAY);
    }

    // Cleanup on failure
    disconnectNetBridge();
    return false;
}
`,
    architecture: `
[Electron UI]
      |
      v
[IPC Messaging Layer]
      |
      v
+-----------------------------------------+
|        Electron Main Process             |
|  - Process orchestration                |
|  - Config generation & injection        |
|  - Connectivity checks                  |
|  - Stats & latency polling              |
+-----------------------------------------+
      |
      v
+----------------------+    +----------------------+
|      Xray Core       |    |    Sing-box (TUN)    |
|  - VLESS + Reality   |<---|  - System TUN iface  |
|  - Local SOCKS port  |    |  - Auto route rules  |
+----------------------+    +----------------------+
              |
              v
+-----------------------------------------+
|        Encrypted Network Tunnel          |
|   (Reality + TLS fingerprint masking)   |
+-----------------------------------------+
              |
              v
+-----------------------------------------+
|            Remote VPS / VM               |
|        (Xray Reality Endpoint)           |
+-----------------------------------------+
`
};
