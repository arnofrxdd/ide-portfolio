export const multiThreadedDownloader = {
    id: "multi_threaded_downloader",
    title: "Multi-Threaded Downloader",
    subtitle: "High-Performance Parallel File Downloader with Visual Thread Control",
    description:
        "A desktop download manager built with Python and PyQt5 that accelerates large file downloads using multi-threaded HTTP range requests, real-time progress visualization, and intelligent retry handling.",
    longDescription: `
Multi-Threaded Downloader is a performance-focused desktop application designed to maximize download throughput by splitting files into multiple byte-range segments and downloading them concurrently.

The system dynamically spawns worker threads that fetch file chunks using HTTP range requests and merges them into a final output once completed. Each thread is independently monitored, with real-time progress tracking, error detection, and retry logic to ensure resilience against unstable connections.

A custom PyQt5 UI visualizes thread activity using animated block indicators, a global progress bar, and live speed/ETA calculations. Users can pause, resume, stop downloads gracefully, and dynamically adjust thread counts using a slider with safety warnings to prevent accidental server abuse.

The application includes intelligent retry handling, per-thread error feedback, drag-and-drop URL support, and a custom frameless window with gesture-based movement, making it both powerful and user-friendly.
`,
    type: "Desktop Application",
    tech: [
        "Python",
        "PyQt5",
        "Multithreading",
        "HTTP Range Requests",
        "Requests",
        "Concurrency Control",
        "Desktop UI"
    ],
    links: {
        github: "https://github.com/arnofrxdd/Multi-Threaded-Downloader"
    },
    image:
        "https://raw.githubusercontent.com/arnofrxdd/Multi-Threaded-Downloader/main/window.png",

    imageStyle: {
        maxWidth: "700px",
        maxHeight: "600px",
        objectFit: "contain"
    },

    date: "2025",
    role: "Creator & Desktop Application Developer",
    highlights: [
        "Parallel chunk-based downloading using HTTP range headers",
        "Real-time per-thread progress visualization",
        "Dynamic thread scaling with safety warnings",
        "Pause, resume, and graceful stop support",
        "Automatic retry handling with backoff strategy",
        "Live speed and ETA calculation",
        "Drag-and-drop URL input",
        "Custom frameless PyQt window with gesture movement"
    ],
    featured: false,
    languages: [
        { name: "Python", percent: 85, color: "#3776ab" },
        { name: "Qt / UI", percent: 15, color: "#41cd52" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "Initial release with multi-threaded downloading and visual thread tracking",
            time: "Latest",
            status: "success"
        }
    ],
    snippet: `// Threaded chunk download with retries
headers = { "Range": f"bytes={start_byte}-{end_byte}" }
response = session.get(url, headers=headers, stream=True)

for chunk in response.iter_content(1024):
    if stop_flag:
        return
    pause_lock.wait()
    f.write(chunk)
`,
    architecture: `
[User Interface (PyQt5)]
        |
        v
[Download Manager Controller]
        |
        v
+------------------------------------+
| Thread Pool                         |
|  - HTTP Range Requests              |
|  - Retry & Error Handling           |
+------------------------------------+
        |
        v
[Progress Aggregation Layer]
  - Per-thread progress
  - Speed & ETA calculation
        |
        v
[File Merger]
  - Combine downloaded parts
        |
        v
[Final Output File]
`
};
