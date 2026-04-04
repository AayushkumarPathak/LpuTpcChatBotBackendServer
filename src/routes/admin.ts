import express from "express";
import { getAllUsers, getAllAdmins } from "../controllers/adminController";
import { protectAdmin } from "../middlewares/authMiddleware";

const router = express.Router();


// Admin-only route to fetch all users (students)
router.get("/all-users", protectAdmin, getAllUsers);

// Admin-only route to fetch all admins
router.get("/all-admins", protectAdmin, getAllAdmins);

export default router;
