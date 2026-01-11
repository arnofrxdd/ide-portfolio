export const shoppingScraper = {
    id: "shopping_scraper",
    title: "Shopping Scraper",
    subtitle: "Concurrent Multi-Store Product Scraping API",
    description:
        "A high-performance Node.js scraping backend that aggregates product data from multiple Indian e-commerce platforms with concurrency control, normalization, and category-aware routing.",
    longDescription: `
Bazzarly Scraper Engine is a Node.js + Express backend designed to fetch, normalize, and aggregate product listings from multiple Indian e-commerce platforms in real time.

The system routes search queries based on category (tech, fashion, accessories) and executes multiple scraper modules concurrently with controlled parallelism to avoid rate limits and blocking. Each scraper runs in isolation with individual error handling, execution timing, and per-site product limits.

Results from all platforms are normalized into a unified schema and returned with detailed timing metadata, enabling downstream AI ranking, filtering, and recommendation pipelines. Google Shopping is handled as a priority scraper with isolated execution to ensure fast fallback data.

The engine is built to be extensible—new scrapers can be added by simply registering a function and defining a product limit—while maintaining predictable performance and fault tolerance.
`,
    type: "Backend Service",
    tech: [
        "Node.js",
        "Express",
        "Web Scraping",
        "Concurrency Control",
        "Cheerio",
        "Async/Await",
        "REST API"
    ],
    links: {
        github: "https://github.com/arnofrxdd/bazzarly-backend"
    },
    image:
        "https://raw.githubusercontent.com/arnofrxdd/portfolio/main/scrapper.png",

    imageStyle: {
        maxWidth: "700px",
        maxHeight: "600px",
        objectFit: "contain"
    },

    date: "2026",
    role: "Backend Architect & Developer",
    highlights: [
        "Category-aware scraper routing (tech, fashion, accessories)",
        "Concurrent scraper execution with configurable parallelism",
        "Per-platform product limits and isolation",
        "Unified product normalization layer",
        "Per-scraper and total execution time tracking",
        "Graceful failure handling per site",
        "Google Shopping prioritized execution path",
        "Extensible plug-and-play scraper architecture"
    ],
    featured: false,
    languages: [
        { name: "JavaScript", percent: 85, color: "#f7df1e" },
        { name: "JSON", percent: 15, color: "#6b7280" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "Initial multi-store scraping engine with concurrency control",
            time: "Latest",
            status: "success"
        }
    ],
    snippet: `// Core concurrent scraper execution
const runScraper = async (fn) => {
  active++;
  const start = Date.now();

  try {
    const limit = LIMITS[fn.name];
    const products = await fn(searchQuery, limit);
    results[fn.name.replace("scrape", "")] = products;
    timings[fn.name] = ((Date.now() - start) / 1000).toFixed(2) + "s";
  } catch (err) {
    results[fn.name] = [];
  } finally {
    active--;
    if (index < scrapers.length) {
      runScraper(scrapers[index++]);
    }
  }
};
`,
    architecture: `
[Client / AI Layer]
        |
        v
[Express API /search]
        |
        v
+------------------------------------+
| Category Router                    |
| (tech / fashion / accessories)     |
+------------------------------------+
        |
        v
+------------------------------------+
| Concurrent Scraper Pool            |
|  - Amazon                          |
|  - Flipkart                        |
|  - Myntra                          |
|  - Ajio                            |
|  - Meesho                          |
|  - Nykaa / NykaaFashion            |
|  - Snapdeal                        |
|  - Reliance Digital                |
|  - Croma                           |
|  - Google Shopping (priority)      |
+------------------------------------+
        |
        v
+------------------------------------+
| Normalization Layer                |
| (unified product schema)           |
+------------------------------------+
        |
        v
[JSON Response + Timing Metadata]
`
};
