import { GoogleGenerativeAI, Content, Part } from '@google/generative-ai';
import { SYSTEM_PROMPT, PLACEMENT_POLICIES } from '../configs/constants';

// This interface defines the structure of history items passed to the service
export interface ChatHistoryItem {
    role: "user" | "model";
    parts: Part[];
}

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model = 'gemini-3-flash-preview';

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error("API key is missing for GeminiService.");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async sendMessage(history: ChatHistoryItem[], userPrompt: string): Promise<{ content: string; requiresHuman: boolean }> {
        const generativeModel = this.genAI.getGenerativeModel({
            model: this.model,
            systemInstruction: SYSTEM_PROMPT.replace('{PLACEMENT_POLICIES}', PLACEMENT_POLICIES),
        });

        const contents: Content[] = [
            ...history,
            { role: 'user', parts: [{ text: userPrompt }] }
        ];

        try {
            const result = await generativeModel.generateContent({
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1000,
                },
            });

            const response = result.response;
            const fullText = response.text();

            if (!fullText) {
                return {
                    content: "I'm sorry, I couldn't generate a response.",
                    requiresHuman: false
                };
            }

            const requiresHuman = fullText.includes("REQUEST_HUMAN_INTERVENTION");
            const cleanedText = fullText.replace("REQUEST_HUMAN_INTERVENTION", "").trim();

            return {
                content: cleanedText,
                requiresHuman
            };
        } catch (error) {
            console.error("Gemini API Error:", error);
            throw new Error("Failed to connect to the TPC Assistant. Please try again later.");
        }
    }
}