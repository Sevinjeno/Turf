import { registerAdmin, fetchAdminById } from '../services/adminService.js';

/**
 * Controller to handle admin registration.
 */
export const createAdminController = async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const newAdmin = await registerAdmin(name, email, phone);
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