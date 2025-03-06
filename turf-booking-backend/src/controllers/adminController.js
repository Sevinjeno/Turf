import { registerAdmin, fetchAdminById, fetchAllAdmins } from '../services/adminService.js';
import { adminValidationSchema } from '../validators/adminValidator.js';
import bcrypt from 'bcrypt';

/**
 * Controller to handle admin registration.
 */
export const createAdminController = async (req, res) => {
    console.log("Request",req.body)
    const { name, email, phone,password } = req.body;
    // const { error } = adminValidationSchema.validate(req.body);
    // if (error) {
    //     return res.status(400).json({ message: error.details[0].message });
    // }
    try {
        console.log("Password",password)
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await registerAdmin(name, email, phone,hashedPassword);
        res.status(201).json({ message: 'Admin created successfully', data: newAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create admin', error: error.message });
    }
};

/**
 * Controller to get an admin by ID.
 */
export const getAdminController = async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await fetchAdminById(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ data: admin });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch admin', error: error.message });
    }
};

export const getAllAdminsController = async (req, res) => {
    try {
        const admins = await fetchAllAdmins();
        res.status(200).json({ data: admins });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch admins", error: error.message });
    }
};





