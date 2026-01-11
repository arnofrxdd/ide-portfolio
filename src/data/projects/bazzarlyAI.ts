export const bazzarlyAI = {
    id: "bazzarly-ai",
    title: "bazzarly.ai",
    subtitle: "AI-Powered Conversational Shopping Assistant",
    description:
        "An AI-driven shopping assistant that guides users through product discovery, filters results intelligently, and surfaces the best buying options in real time.",
    longDescription: `
bazzarly.ai is an experimental AI-powered shopping assistant that combines conversational decision-making with real product discovery. Instead of traditional filters, users interact with an adaptive AI flow that understands intent, context, and constraints before presenting curated product results.

The frontend is built with React and Framer Motion, delivering a fluid, animated experience with dynamic question flows, real-time loading states, and product cards enriched with seller links, ratings, and pricing. Users can either start guided shopping or perform direct manual searches.

On the backend, the application fetches raw product data from a search service and then re-processes it using an AI layer. The AI refines results by relevance, removes noise, and selects the most suitable products based on conversational context and user decisions. Conversation history is pruned intelligently to maintain relevance and reduce prompt size.

Robust JSON parsing and retry mechanisms are implemented to handle inconsistent AI outputs, ensuring the UI remains stable even when model responses are imperfect. The result is a resilient, human-like shopping experience that feels closer to a personal shopping assistant than a search engine.
`,
    type: "AI Web Application",
    tech: [
        "React",
        "Framer Motion",
        "Node.js",
        "AI Prompt Engineering",
        "JSON5",
        "REST APIs",
        "Conversational State Machines",
        "Product Aggregation"
    ],
    links: {
        github: "https://github.com/arnofrxdd/portfolio"
    },
    image:
        "https://raw.githubusercontent.com/arnofrxdd/portfolio/main/Screenshot%202026-01-12%20000244.png",

    imageStyle: {
        maxWidth: "1000px",
        maxHeight: "800px",
        objectFit: "contain"
    },

    date: "2026",
    role: "Frontend & AI Logic Developer",
    highlights: [
        "Conversational AI-driven shopping flow",
        "Manual and guided product discovery modes",
        "AI-based product filtering and ranking",
        "Resilient JSON parsing for unreliable AI output",
        "Animated UI with Framer Motion",
        "Context-aware prompt construction",
        "Multi-stage loading feedback",
        "Real-time seller comparison and external buy links"
    ],
    featured: false,
    languages: [
        { name: "JavaScript", percent: 70, color: "#f7df1e" },
        { name: "React", percent: 20, color: "#61dafb" },
        { name: "CSS", percent: 10, color: "#38bdf8" }
    ],
    deployHistory: [
        {
            version: "v1.0",
            msg: "Initial AI shopping flow with guided questions and product aggregation",
            time: "Latest",
            status: "success"
        }
    ],
    snippet: `// Fetch products → refine via AI → update conversational flow
const backendProducts = await retryFetch(
  \`/search?q=\${searchQuery}/\${category}\`
);

const aiPrompt = AI_PRODUCT_FILTER_PROMPT(context, backendProducts);
const aiResponse = await retryFetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({ prompt: aiPrompt })
});

const bestProducts = JSON.parse(aiResponse.text);
setStepData({ products: bestProducts });
`,
    architecture: `
[ User Interface (React + Framer Motion) ]
              |
              v
[ Conversational State Manager ]
              |
              v
[ Product Search Backend ]
              |
              v
[ AI Refinement Layer ]
  - Context pruning
  - Prompt generation
  - JSON sanitation
              |
              v
[ Curated Product Results ]
  - Prices
  - Ratings
  - Seller links
`
};
