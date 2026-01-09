import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with env variable or local storage.
const getAPIKey = () => import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || '';

export const aiService = {
    async generateQuestions(subject: string, classLevel: string, topic: string): Promise<any[]> {
        const key = getAPIKey();
        if (!key) {
            throw new Error("API Key Missing! Admin needs to configure VITE_GEMINI_API_KEY or set it in settings.");
        }

        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Generate a JSON array of 5 academic questions for a Class ${classLevel} student on the subject "${subject}" related to the topic "${topic}".
        Each question object must have:
        - "id": number
        - "text": string (the question)
        - "marks": number (between 2 and 5)
        - "type": string ("Short" or "Long" or "MCQ")
        
        Output ONLY the JSON string, no markdown code blocks.`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Cleanup potential markdown formatting
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error("AI Generation Error:", error);
            throw new Error("Failed to generate questions. Check API Key or Quota.");
        }
    }
};
