export const cdcSolver = {
    id: "cdc_solver",
    title: "CDC Solver",
    subtitle: "Encrypted Exam Data Extraction & Automation Engine",
    description:
        "A Chrome extension that reverse-engineers encrypted exam payloads, extracts answers client-side, and automates section-aware question solving using DOM mutation analysis.",
    longDescription: `
CDC Solver is an advanced Chrome extension built to analyze, decrypt, and automate interactions with modern web-based examination platforms.

The project operates entirely client-side by injecting scripts into the page context, intercepting encrypted payloads, reconstructing encryption keys from runtime data, and decrypting exam content in real time. Extracted answers are normalized into structured sections containing MCQs, fill-in-the-blank answers, and coding solutions across multiple languages.

A robust automation engine then detects the active exam section using DOM mutation observers and URL change tracking, ensuring answers are applied to the correct section even in single-page applications. The system supports automatic navigation, intelligent option selection, input simulation, and safe termination.

The extension also includes a polished popup UI that displays decoded answers, section selectors, live automation status, and copy-ready coding solutions with language tabs.
`,
    type: "Browser Extension",
    tech: [
        "JavaScript",
        "Chrome Extensions",
        "DOM MutationObserver",
        "Client-Side Cryptography",
        "CryptoJS",
        "Reverse Engineering",
        "Web Automation"
    ],
    links: {
        github: "https://github.com/arnofrxdd/CDCSolver"
    },
    image:
        "https://raw.githubusercontent.com/arnofrxdd/CDCSolver/main/Screenshot%202026-01-12%20002124.png",

    imageStyle: {
        maxWidth: "320px",
        maxHeight: "600px",
        objectFit: "contain"
    },

    date: "2026",
    role: "Reverse Engineer & Automation Developer",
    featured: false,

    highlights: [
        "Client-side decryption of encrypted exam payloads",
        "Dynamic key reconstruction using runtime user data",
        "DOM-based section detection with fallback strategies",
        "MutationObserver-driven SPA compatibility",
        "Automated MCQ and fill-in-the-blank solving",
        "Multi-language coding solution extraction",
        "Chrome storage–based state synchronization",
        "Popup UI with section filtering and live automation status"
    ],

    languages: [
        { name: "JavaScript", percent: 90, color: "#f7df1e" },
        { name: "HTML/CSS", percent: 10, color: "#38bdf8" }
    ],

    deployHistory: [
        {
            version: "v1.0",
            msg: "Initial encrypted payload extraction and answer automation",
            time: "Latest",
            status: "success"
        }
    ],

    snippet: `// Detect active exam section reliably
detectCurrentSectionIndex() {
  const match = document.body.textContent.match(/Section\\s*(\\d+)\\s*\\/\\s*(\\d+)/);
  if (match) {
    this.currentSectionIndex = parseInt(match[1]) - 1;
    return;
  }
  this.currentSectionIndex = 0;
}

// Core MCQ automation
const correctIndex = this.getOptionIndex(question.correctOptionLetter);
const option = document.querySelectorAll('[id*="tt-option"]')[correctIndex];
option?.click();
`,

    architecture: `
[Exam Web App]
        |
        v
[Injected Page Script]
        |
        v
[Encrypted Payload Interception]
        |
        v
[Key Reconstruction]
(userId + schoolId + static salt)
        |
        v
[CryptoJS AES Decryption]
        |
        v
+-------------------------------+
| Answer Normalization Layer   |
|  - Sections                  |
|  - MCQs                      |
|  - Fill-in-Blanks            |
|  - Coding Solutions          |
+-------------------------------+
        |
        v
[Chrome Storage Sync]
        |
        v
+-------------------------------+
| Automation Engine            |
|  - Section Detection         |
|  - Question Navigation       |
|  - DOM Interaction           |
+-------------------------------+
        |
        v
[Popup UI + Live Control]
`
};
