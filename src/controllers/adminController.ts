import User from "../models/User";
import Admin from "../models/Admin";
import { Request, Response } from "express";

// Fetch all users (students) - admin only
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ role: 'student' }, "-password");
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Fetch all admins - admin only
export const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await Admin.find({}, "-password");
        res.json({ admins });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
