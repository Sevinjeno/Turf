import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as superAdminModel from '../models/superAdminModel.js';
import { generateAccessToken } from '../utils/jwtUtils.js';

// Super Admin Registration
export const registerSuperAdmin = async (req, res) => {
    const { username, password } = req.body;
    ("USer",req.body)

    try {
        const existingAdmin = await superAdminModel.getSuperAdminByUsername(username);
        if (existingAdmin) {
            return res.status(400).json({ message: 'Super Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await superAdminModel.createSuperAdmin(username, hashedPassword);

        res.status(201).json({ message: 'Super Admin created successfully', admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Error creating Super Admin', error: error.message });
    }
};

// Super Admin Login
export const loginSuperAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const superAdmin = await superAdminModel.getSuperAdminByUsername(username);

        if (!superAdmin) {
            return res.status(404).json({ message: 'Super Admin not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

           // Generate JWT token
           const token = generateAccessToken({
            id: superAdmin.id,
            username: superAdmin.username,
            role: 'superadmin', // Include the role explicitly
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
