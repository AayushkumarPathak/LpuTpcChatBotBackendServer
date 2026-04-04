import User from "../models/User";
import { Request, Response } from "express";

// Fetch all students (users with role 'student')
export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const students = await User.find({ role: 'student' }, "-password");
        res.json({ students });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update student by regNo (admin only)

export const updateStudent = async (req: Request, res: Response) => {
    const { regNo } = req.params;
    const { name, dob } = req.body;
    if (!name || !dob) {
        return res.status(400).json({ message: "Name and DOB are required" });
    }
    try {
        const updated = await User.findOneAndUpdate(
            { regNo },
            { name, dob },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student updated", student: updated });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete student by regNo (admin only)
export const deleteStudent = async (req: Request, res: Response) => {
    const { regNo } = req.params;
    try {
        const deleted = await User.findOneAndDelete({ regNo });
        if (!deleted) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student deleted", student: deleted });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};