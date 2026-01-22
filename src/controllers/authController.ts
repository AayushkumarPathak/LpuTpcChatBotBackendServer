import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import Admin, { IAdmin } from '../models/Admin';
import bcrypt from 'bcryptjs';

// Helper to generate default password
const generateDefaultPassword = (name: string, dob: string) => {
    const namePart = name.substring(0, 4).toUpperCase();
    const dobPart = dob.replace(/-/g, ''); // YYYY-MM-DD -> YYYYMMDD
    return `${namePart}${dobPart}`;
};
// @desc   Register a new admin
// @route  POST /api/auth/admin/register
export const registerAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ message: 'Admin already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const admin = await Admin.create({ email, password: hashedPassword });
        res.status(201).json({ message: 'Admin registered successfully', admin: { email: admin.email, id: admin._id } });
    } catch (error) {
        res.status(500).json({ message: 'Server error during admin registration.' });
    }
};

// @desc   Login admin & get token
// @route  POST /api/auth/admin/login
export const loginAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: admin._id, role: 'admin', email: admin.email },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );
        res.json({
            token,
            email: admin.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during admin login.' });
    }
};

// @desc   Register multiple users (Admin only)
// @route  POST /api/auth/register-bulk
export const registerBulk = async (req: Request, res: Response) => {
    // Assuming req.user.role === 'admin' from auth middleware
    const usersData: { regNo: string, name: string, dob: string }[] = req.body;

    if (!usersData || !Array.isArray(usersData)) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        const createdUsers = [];
        for (const userData of usersData) {
            const { regNo, name, dob } = userData;
            const userExists = await User.findOne({ regNo });

            if (userExists) {
                console.warn(`User with regNo ${regNo} already exists. Skipping.`);
                continue;
            }

            const password = generateDefaultPassword(name, dob);
            const user = await User.create({ regNo, name, dob, password });
            createdUsers.push({ regNo: user.regNo, name: user.name });
        }
        res.status(201).json(createdUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server error during bulk registration.' });
    }
};

// @desc   Authenticate user & get token
// @route  POST /api/auth/login
export const login = async (req: Request, res: Response) => {
    const { regNo, password } = req.body;

    try {
        const user = await User.findOne({ regNo });

        if (!user) {
            console.log(`Login attempt with invalid regNo: ${regNo}`);
            return res.status(401).json({ message: 'User not found. Please contact TPC Admin.' });
        }

        if (await user.matchPassword(password)) {
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: '1d' }
            );

            res.json({
                token,
                regNo: user.regNo,
                name: user.name,
                isPasswordReset: user.isPasswordReset
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};