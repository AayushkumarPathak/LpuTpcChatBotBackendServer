import 'dotenv/config';
import { Request, Response } from 'express';
import { GroqService, ChatHistoryItem } from '../services/groqService';

// Initialize the Groq Service.
// This creates a single instance to be used by the controller.
const groqService = new GroqService();

// Helper to map frontend's role 'student' to 'user' for the Groq service
const mapHistory = (history: any[]): ChatHistoryItem[] => {
    if (!history) return [];
    return history.map(msg => ({
        role: msg.role === 'student' ? 'user' : 'assistant',
        content: msg.parts[0].text,
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
        const result = await groqService.sendMessage(chatHistory, message);
        console.log("\n\nRequest processed by groq... update3\n\n")
        res.json({ message: result.content, requiresHuman: result.requiresHuman });
    } catch (error) {
        console.error('Error in handleChat:', error);
        res.status(500).json({ message: 'Error communicating with the TPC Assistant' });
    }
};