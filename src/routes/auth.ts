// /server/src/routes/auth.ts
import express from 'express';
import { registerBulk, login, registerAdmin, loginAdmin } from '../controllers/authController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

// router.post('/register-bulk', protect, admin, registerBulk);

// Admin registration and login
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

router.post('/register-bulk', registerBulk);
router.post('/login', login);

export default router;