export const momentClock = {
    id: "moment_clock",
    title: "MomentClock",
    subtitle: "A Living Clock with Dynamic Sky & Celestial Motion",
    description:
        "MomentClock is an immersive, real-time visual clock that transforms the passage of time into a living environment with dynamic skies, celestial motion, and smooth time-based transitions.",
    longDescription: `
MomentClock is an interactive React-based time visualization project that converts real-world time into a continuously evolving environment.

The application dynamically interpolates sky gradients at a minute-level resolution, ensuring seamless transitions throughout the day. The sun and moon move across the screen based on actual time calculations, while stars fade in and out depending on night cycles.

A custom astronomical algorithm determines the current moon phase and renders it using CSS clip-paths, accurately reflecting real lunar behavior. Environmental elements such as mountains, clouds, brightness, and text color adapt based on the time of day to maintain visual harmony and readability.

MomentClock also supports gesture-based interaction: users can swipe or double-tap to shift perspective depth, creating a subtle parallax-style experience. The project is fully responsive, optimized for both desktop and mobile touch input.
`,
    type: "Frontend / Visual Simulation",
    tech: [
        "React",
        "JavaScript",
        "CSS Animations",
        "Clip-Path",
        "Time-Based Interpolation",
        "Gesture Handling"
    ],
    links: {
        github: "https://github.com/arnofrxdd/portfolio",
        live: "https://arnofrxdd.github.io/MomentClock/"
    },
    image:
        "https://raw.githubusercontent.com/arnofrxdd/portfolio/main/Screenshot%202026-01-12%20003326.png",

    imageStyle: {
        maxWidth: "900px",
        maxHeight: "600px",
        objectFit: "contain"
    },

    date: "2026",
    role: "Frontend Developer & Designer",
    highlights: [
        "Minute-level gradient interpolation for smooth sky transitions",
        "Accurate astronomical moon phase calculation",
        "Real-time sun & moon positioning synced with system time",
        "Dynamic star visibility based on night cycle",
        "Gesture-based interaction (swipe & double-click)",
        "Fully responsive with mobile touch support",
        "Adaptive text color and environment brightness"
    ],
    featured: false,
    languages: [
        { name: "JavaScript", percent: 85, color: "#f7df1e" },
        { name: "CSS", percent: 15, color: "#2965f1" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "Initial release with dynamic sky, sun/moon motion, and lunar phases",
            time: "Latest",
            status: "success"
        }
    ],
    snippet: `// Minute-level gradient interpolation
const factor = minute / 60;
const interpolatedColor1 = interpolateColor(
  currentGradientColors[0],
  nextGradientColors[0],
  factor
);
const interpolatedColor2 = interpolateColor(
  currentGradientColors[1],
  nextGradientColors[1],
  factor
);
`,
    architecture: `
[System Time]
      |
      v
[Time Calculation Layer]
  - Hour / Minute
  - Total Minutes
      |
      v
[Visual Mapping Engine]
  - Sky Gradient Interpolation
  - Sun & Moon Position
  - Star Visibility
  - Text Color Adaptation
      |
      v
[Astronomy Logic]
  - Julian Date
  - Moon Age
  - Moon Phase Detection
      |
      v
[React Render Layer]
  - Environment
  - Clock UI
  - Gestures & Animations
`
};
