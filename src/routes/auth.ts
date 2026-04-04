// /server/src/routes/auth.ts
import express from 'express';
import { registerBulk, login, registerAdmin, loginAdmin } from '../controllers/authController';
import { protectAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

// Admin routes
router.post('/admin/login', loginAdmin);
router.post('/admin/register', protectAdmin, registerAdmin); // Only authenticated admins can create new admins

// Bulk student registration (Admin only)
router.post('/register-bulk', protectAdmin, registerBulk);
router.post('/upadteStudent', protectAdmin, )
// Student login
router.post('/login', login);

export default router;