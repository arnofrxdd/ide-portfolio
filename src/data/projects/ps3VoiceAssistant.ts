
export const ps3VoiceAssistant = {
    id: "ps3_voice_assistant",
    title: "PS3 Voice Assistant",
    subtitle: "Voice-Controlled PS3 Automation via webMAN & Gemini AI",
    description:
        "A browser-based voice assistant that lets you control a PlayStation 3 hands-free using natural speech, integrating webMAN MOD with Gemini AI for intelligent intent parsing and game matching.",
    longDescription: `
PS3 Voice Assistant is a React-based, browser-accessible voice control system for the PlayStation 3, designed to bridge modern AI with legacy console hardware.

The assistant listens for configurable wake words, captures natural-language voice commands, and forwards them to a Gemini-powered intent parser. Gemini analyzes the request in the context of installed PS3 games and live system state, returning structured actions such as mounting games, launching titles, exiting gameplay, querying temperatures, or adjusting fan behavior.

All commands are executed through webMAN MOD’s HTTP interface, allowing real-time control of game mounting, playback, fan modes, and system monitoring. The system intelligently handles conflicts—preventing game launches while another title is running—and provides spoken feedback via browser text-to-speech.

The UI is intentionally minimal, centered around a reactive orb that visually represents assistant states (idle, listening, processing, responding). The entire system runs on any device with a modern browser, requiring no native installation on the PS3 itself.
`,
    type: "Full Stack Application",
    tech: [
        "React",
        "Node.js",
        "Express",
        "Gemini AI",
        "Speech Recognition API",
        "Text-to-Speech",
        "webMAN MOD",
        "HTTP Automation"
    ],
    links: {
        github: "https://github.com/arnofrxdd/ps3-voice-assistant"
    },
    image:
        "https://raw.githubusercontent.com/arnofrxdd/portfolio/main/Screenshot%202026-01-12%20004612.png",

    imageStyle: {
        maxWidth: "700px",
        maxHeight: "600px",
        objectFit: "contain"
    },

    date: "2026",
    role: "Full Stack Developer & System Designer",
    highlights: [
        "Hands-free PS3 control using natural language voice commands",
        "Gemini-powered intent detection with context-aware game matching",
        "Smart handling of game conflicts and running titles",
        "Fuzzy matching and collection-aware game resolution",
        "Real-time CPU/RSX temperature and fan control via webMAN",
        "Browser-based Text-to-Speech voice feedback",
        "Wake-word driven assistant flow with continuous listening",
        "Minimal reactive orb UI with assistant state visualization",
        "Runs on any device without installing software on the PS3"
    ],
    featured: false,
    languages: [
        { name: "JavaScript", percent: 90, color: "#f7df1e" },
        { name: "JSON", percent: 10, color: "#6b7280" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "Initial release with voice control, Gemini intent parsing, and full webMAN integration",
            time: "Latest",
            status: "success"
        }
    ],
    snippet: `// Execute Gemini-selected PS3 command
const executeCommand = async (intent, parsed, chosenGame) => {
  const send = async (url) => {
    await fetch(url);
  };

  switch (intent) {
    case "play_game":
      await send(\`/ps3\${chosenGame.playUrl}\`);
      break;
    case "mount_game":
      await send(\`/ps3\${chosenGame.mountUrl}\`);
      break;
    case "exit_game":
      await send("/ps3/xmb.ps3$exit");
      break;
  }
};
`,
    architecture: `
[Browser UI (React)]
        |
        v
[Speech Recognition + Wake Word Detection]
        |
        v
[Gemini AI Intent Parser]
        |
        v
+------------------------------------+
| Context-Aware Decision Layer       |
|  - Installed Games                 |
|  - Running Game State              |
|  - System Temperatures             |
+------------------------------------+
        |
        v
+------------------------------------+
| webMAN MOD HTTP Interface          |
|  - Mount / Play Games              |
|  - Exit Game                       |
|  - Fan Control                     |
|  - CPU / RSX Temps                 |
+------------------------------------+
        |
        v
[PS3 Console Execution + TTS Feedback]
`
};
