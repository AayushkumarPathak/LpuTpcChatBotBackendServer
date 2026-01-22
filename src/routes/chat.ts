// /server/src/routes/chat.ts
import express from 'express';
import { handleChat } from '../controllers/chatController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, handleChat);

export default router;