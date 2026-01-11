export const xrayRealityTunnel = {
    id: "xray_reality_oracle",
    title: "Xray Reality Secure Tunnel",
    subtitle: "Stealth VLESS + Reality Deployment on Oracle Cloud",
    description:
        "A secure, high-performance Xray deployment using VLESS with Reality (XTLS Vision) on Oracle Cloud, designed for resilient encrypted connectivity under restrictive network environments.",
    longDescription: `
Xray Reality Tunnel is a cloud-hosted secure networking project built on Xray Core, leveraging the VLESS protocol with Reality (XTLS Vision) to provide encrypted, low-latency connections that closely resemble standard HTTPS traffic.

The system is deployed on Oracle Cloud Infrastructure and listens on a non-standard TLS-compatible port, allowing it to blend naturally with typical web traffic patterns. Reality eliminates the need for traditional TLS certificates by cryptographically impersonating legitimate HTTPS endpoints during the handshake phase.

Multiple clients are supported with independent UUIDs, traffic statistics collection, and API-level introspection. The setup emphasizes minimal exposure, strong encryption, and operational stability while maintaining high throughput via XTLS Vision.

This project focuses on real-world secure transport design, protocol fingerprinting awareness, and cloud-based networking architecture using modern censorship-resistant techniques.
`,
    type: "Infrastructure / Networking",
    tech: [
        "Xray Core",
        "VLESS",
        "Reality (XTLS Vision)",
        "Oracle Cloud Infrastructure",
        "TCP Transport",
        "Encrypted Tunneling",
        "Traffic Statistics",
        "Cloud Networking"
    ],
    links: {
        github: "https://github.com/arnofrxdd/xray-reality-oracle"
    },
    image:
        "https://raw.githubusercontent.com/arnofrxdd/portfolio/main/Screenshot%202026-01-12%20005751.png",

    imageStyle: {
        maxWidth: "700px",
        maxHeight: "600px",
        objectFit: "contain"
    },

    date: "2026",
    role: "Infrastructure Engineer",
    highlights: [
        "VLESS + Reality (XTLS Vision) secure transport deployment",
        "Oracle Cloud–hosted server with hardened inbound exposure",
        "Non-certificate TLS camouflage using Reality destination spoofing",
        "Multi-client UUID support with isolated flows",
        "Traffic statistics via Xray API and policy system",
        "Minimal attack surface with direct and blackhole routing",
        "Low-latency TCP transport optimized for stability",
        "Production-ready logging and observability configuration"
    ],
    featured: false,
    languages: [
        { name: "JSON", percent: 80, color: "#6b7280" },
        { name: "Shell", percent: 20, color: "#4ade80" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "Initial Oracle Cloud deployment with VLESS Reality and XTLS Vision",
            time: "Latest",
            status: "success"
        }
    ],
    snippet: `// VLESS + Reality inbound (XTLS Vision)
{
  "protocol": "vless",
  "port": 8443,
  "settings": {
    "clients": [
      {
        "id": "<UUID>",
        "flow": "xtls-rprx-vision"
      }
    ],
    "decryption": "none"
  },
  "streamSettings": {
    "network": "tcp",
    "security": "reality",
    "realitySettings": {
      "dest": "www.google.com:443",
      "serverNames": ["www.google.com"],
      "shortIds": ["abcd1234"]
    }
  }
}
`,
    architecture: `
[Client Device]
        |
        v
[VLESS Protocol]
        |
        v
[XTLS Vision Encryption]
        |
        v
[Reality Handshake Layer]
        |
        v
+------------------------------------+
| Oracle Cloud VM                    |
|  - Xray Core                       |
|  - VLESS Inbound (8443/TCP)        |
|  - Reality TLS Camouflage          |
+------------------------------------+
        |
        v
[Direct Internet Access]
`
};
