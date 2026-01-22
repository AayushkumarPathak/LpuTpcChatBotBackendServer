import 'dotenv/config';
import { Request, Response } from 'express';
import { GeminiService, ChatHistoryItem } from '../services/geminiService';

// Initialize the Gemini Service with the API key from environment variables.
// This creates a single instance to be used by the controller.
const geminiService = new GeminiService(process.env.GEMINI_API_KEY!);

// Helper to map frontend's role 'student' to 'user' for the Gemini service
const mapHistory = (history: any[]): ChatHistoryItem[] => {
    if (!history) return [];
    return history.map(msg => ({
        role: msg.role === 'student' ? 'user' : 'model',
        parts: msg.parts,
    }));
};

// @desc   Handle chat requests
// @route  POST /api/chat
export const handleChat = async (req: Request, res: Response) => {
    const { history, message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Missing message in request body' });
    }

    const chatHistory = mapHistory(history);

    try {
        const result = await geminiService.sendMessage(chatHistory, message);
        console.log("\n\nRequest processed by gemini...\n\n")
        res.json({ message: result.content, requiresHuman: result.requiresHuman });
    } catch (error) {
        console.error('Error in handleChat:', error);
        res.status(500).json({ message: 'Error communicating with the TPC Assistant' });
    }
};