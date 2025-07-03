import { createAdmin, getAdminById, getAllAdmins } from '../models/adminModel.js';

export const registerAdmin = async (name, email, phone,password) => {
    return await createAdmin(name, email, phone,password);
};

export const fetchAdminById = async (id) => {
    return await getAdminById(id);
};

export const fetchAllAdmins = async (req, res) => {
    return await getAllAdmins()
};