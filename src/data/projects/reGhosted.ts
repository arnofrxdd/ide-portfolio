export const reGhosted = {
    id: "reghosted",
    title: "ReGhosted",
    subtitle: "One-Click CyberGhost Trial Reset & Account Regenerator",
    description:
        "A lightning-fast C++ GUI utility that automates CyberGhost trial resets and temporary account regeneration with a single click.",
    longDescription: `
ReGhosted is a fully rewritten C++ desktop utility that automates the CyberGhost trial reset process and temporary account regeneration without any manual interaction.

Originally developed as a Python-based CLI tool, ReGhosted was redesigned from the ground up into a lightweight, standalone Windows GUI application focused on speed, reliability, and automation.

The tool handles the entire lifecycle: terminating CyberGhost processes, purging registry traces, launching the application in a controlled state, generating disposable email accounts, registering new CyberGhost credentials, confirming accounts via UI automation, and injecting credentials directly into the app — all while providing live logs, progress feedback, and safety cooldown enforcement.

Multithreading, UIAutomation, and low-level Win32 APIs are used extensively to ensure stability, responsiveness, and minimal user intervention.
`,
    type: "Desktop Tool",
    tech: [
        "C++",
        "Win32 API",
        "UIAutomation",
        "Windows Registry",
        "Multithreading",
        "COM",
        "WinInet",
        "RichEdit",
        "Common Controls"
    ],
    links: {
        github: "https://github.com/arnofrxdd/ReGhosted",
        live: "https://github.com/sillyLazyCat/ReGhosted/releases"
    },
    image:
        "https://raw.githubusercontent.com/sillyLazyCat/ReGhosted/main/preview.gif",
    date: "2024",
    role: "UI Polish, Optimization & C++ Rewrite",
    highlights: [
        "One-click CyberGhost trial reset",
        "Automated disposable email registration",
        "Direct credential injection into CyberGhost",
        "Full GUI with live logs and progress bar",
        "Background execution with window hiding",
        "UIAutomation-driven account confirmation",
        "Automatic retry & self-recovery logic",
        "24-hour cooldown enforcement system",
        "Lightweight standalone (~100KB) executable"
    ],
    featured: false,
    languages: [
        { name: "C++", percent: 95, color: "#00599C" },
        { name: "Win32 Resources", percent: 3, color: "#6b7280" },
        { name: "Config", percent: 2, color: "#9ca3af" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "C++ GUI rewrite with full automation pipeline",
            time: "Latest",
            status: "success"
        },
        {
            version: "Legacy",
            msg: "Original Python CLI version (fuckVITBPL)",
            time: "Earlier",
            status: "success"
        }
    ],
    snippet: `// Core execution flow
void runReGhosted()
{
    // Stop if reset is on cooldown
    if (isCooldownActive())
        return;

    // Close CyberGhost and clear trial data
    terminateProcess(L"Dashboard.exe");
    deleteRegistryTree(HKEY_CURRENT_USER, L"Software\\CyberGhost");
    deleteRegistryTree(
        HKEY_CURRENT_USER,
        L"Software\\Microsoft\\Windows\\CurrentVersion\\WinTrust"
    );

    // Start CyberGhost in a clean state
    launchCyberGhostHidden();
    waitForCyberGhostLoginUI();

    // Generate temporary email account
    TempMailAccount mail = createTempMailAccount();

    // Register new CyberGhost account automatically
    fillLoginField(L"BoxLoginField", mail.email);
    fillLoginField(L"BoxPasswordField", mail.password);
    fillLoginField(L"BoxEdtPasswordRepeat", mail.password);
    clickUIButton(L"Dashboard:CreateAccountPage:SignUpButton");

    // Wait for confirmation email and complete registration
    waitForAndConfirmAccount(mail.token);

    // Save cooldown to prevent repeated resets
    saveCooldownTimestamp(COOLDOWN_HOURS);
}

`,
    architecture: `
[User Click]
      |
[Win32 GUI Thread]
      |
[Worker Thread Pool]
      |
+------------------------------+
|  Process Control (Dashboard) |
|  Registry Cleanup            |
|  Disposable Email API        |
|  UIAutomation Tree Walker    |
|  Multithreaded Monitoring    |
+------------------------------+
      |
[CyberGhost App]
      |
[Fresh Trial Account Active]
`
};
