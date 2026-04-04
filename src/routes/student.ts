import express from "express";
import { getAllStudents, updateStudent, deleteStudent } from "../controllers/studentController";
import { protectAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

// Admin-only route to fetch all students
router.get("/all-students", protectAdmin, getAllStudents);

// Update student (admin only)
router.put("/update/:regNo", protectAdmin, updateStudent);

// Delete student (admin only)
router.delete("/delete/:regNo", protectAdmin, deleteStudent);

export default router;
