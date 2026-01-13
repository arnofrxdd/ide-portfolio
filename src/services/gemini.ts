import { PROJECTS_DATA } from "../data/projects";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `
You are a CLI Assistant for Arnav's Portfolio. 
Answer purely in text/markdown suitable for a terminal window.
Keep responses concise, technical, and cool.
Data Context:
`;

export const generateGeminiResponse = async (userMessage: string) => {
    try {
        const dataContext = JSON.stringify(PROJECTS_DATA.map(p => ({
            title: p.title,
            tech: p.tech,
            description: p.description,
            type: p.type
        })));

        const fullPrompt = `${SYSTEM_PROMPT} \n CONTEXT_DATA: ${dataContext} \n\n USER_COMMAND: ${userMessage}`;

        if (!apiKey) {
            await new Promise(r => setTimeout(r, 1000));
            return "AI: API Key missing, but I hear you loud and clear. (Set VITE_GEMINI_API_KEY)";
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: fullPrompt }] }]
                }),
            }
        );

        if (!response.ok) throw new Error("AI Busy");
        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text || "Segmentation fault (core dumped) - just kidding, API error.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Error: Unable to pipe data to neural net.";
    }
};
