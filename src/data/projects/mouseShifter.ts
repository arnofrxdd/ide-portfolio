export const mouseShifter = {
    id: "mouse_shifter",
    title: "MouseShifter",
    subtitle: "Mouse-based H-Pattern Gear Shifter for Racing Games",
    description:
        "A low-latency C++ desktop tool that converts mouse movement into an H-pattern gear shifter using vJoy, enabling realistic manual shifting in racing games without dedicated hardware.",
    longDescription: `
MouseShifter is a Windows desktop utility that allows users to operate an H-pattern manual gear shifter using a mouse, while still retaining normal mouse steering or camera control.

The application works by intercepting low-level mouse and controller input using Win32 hooks, DirectInput, and XInput. Mouse movement is mapped onto configurable H-pattern layouts (6-speed, 12-speed, and 16-speed), and the resolved gear state is sent to games through a vJoy virtual joystick.

By emulating a real hardware shifter, MouseShifter enables proper gear bindings in racing and simulation titles that do not natively support mouse-based gear selection.

Advanced features include dual-mouse setups (separate steering and shifting devices), experimental controller integration, mouse steering, scroll-wheel clutch control, and optional input blocking to prevent unintended in-game actions — all designed to deliver a realistic driving experience without additional physical hardware.
`,
    type: "Desktop Tool",
    tech: [
        "C++",
        "Win32 API",
        "Raw Input",
        "Windows Hooks",
        "vJoy",
        "XInput",
        "DirectInput"
    ],
    links: {
        github: "https://github.com/arnofrxdd/MouseShifter",
        live: "https://arnofrxdd.github.io/MouseShifter/"
    },
    image:
        "https://github.com/arnofrxdd/MouseShifter/raw/assets/MouseShifter.png",
    date: "2024",
    role: "Creator & Lead Developer",
    highlights: [
        "Mouse-driven H-pattern gear shifting",
        "Configurable 6 / 12 / 16 gear layouts",
        "Low-level mouse and controller input hooks",
        "vJoy-based virtual joystick emulation",
        "Dual mouse support for steering and shifting",
        "Optional mouse steering mode",
        "Scroll-wheel clutch axis emulation",
        "Mouse, XInput, and DirectInput blocking",
        "Designed for sim racing without physical shifter hardware"
    ],
    featured: true,
    languages: [
        { name: "C++", percent: 80, color: "#00599C" },
        { name: "C", percent: 10, color: "#555555" },
        { name: "Config", percent: 10, color: "#6b7280" }
    ],
    deployHistory: [
        {
            version: "v2.5",
            msg: "Stability improvements, refined gear mapping, and feature enhancements",
            time: "Latest",
            status: "success"
        },
        {
            version: "v2.0",
            msg: "Introduced controller support, input blocking, and dual mouse handling",
            time: "Earlier",
            status: "success"
        }
    ],
    snippet: `// MouseShifter core execution flow
void processMouseShifter()
{
    // Read low-level mouse and controller input
    MouseState mouse = readRawMouseInput();
    ControllerState controller = readControllerInput();

    // Determine whether shifter mode should be active
    if (!isShifterModeActive(mouse, controller))
        return;

    // Convert mouse movement into H-pattern coordinates
    int gear = resolveGearFromHPattern(
        mouse.deltaX,
        mouse.deltaY,
        activeGearLayout // 6 / 12 / 16-speed
    );

    // Optionally block normal input to avoid conflicts
    if (inputBlockingEnabled)
        suppressMouseAndControllerInput();

    // Update virtual joystick state
    vJoy.clearAllButtons();
    vJoy.setButton(gear, true);

    // Optional clutch emulation using mouse scroll
    if (scrollClutchEnabled)
        vJoy.setAxis(CLUTCH_AXIS, mouse.scrollDelta);

    // Optional mouse steering passthrough
    if (mouseSteeringEnabled)
        applyMouseSteering(mouse.deltaX);
}
`,
    architecture: `
[Raw Mouse Input]           [Controller / Wheel Input]
        |                               |
        v                               v
+--------------------------------------------------+
|          Low-Level Input Capture Layer            |
|  (Win32 Hooks / Raw Input / DirectInput / XInput) |
+--------------------------------------------------+
                          |
                          v
+--------------------------------------------------+
|            MouseShifter Core Logic                |
|  - Shifter mode detection                         |
|  - H-pattern grid calculation                     |
|  - Gear resolution (6 / 12 / 16-speed)            |
|  - Feature toggles & input profiles               |
+--------------------------------------------------+
                          |
                          v
+--------------------------------------------------+
|            Input Mapping & Control Layer          |
|  - Gear-to-button mapping                         |
|  - Axis scaling (clutch / steering)               |
|  - Input blocking and passthrough                 |
+--------------------------------------------------+
                          |
                          v
+--------------------------------------------------+
|              vJoy Virtual Joystick                |
|  - Button outputs (gear positions)                |
|  - Axis outputs (clutch / steering)               |
+--------------------------------------------------+
                          |
                          v
+--------------------------------------------------+
|                  Game Engine                      |
|   (ETS2 / ATS / BeamNG / Forza Horizon, etc.)     |
+--------------------------------------------------+
`
};
