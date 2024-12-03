import { createAdmin, getAdminById } from '../models/adminModel.js';

export const registerAdmin = async (name, email, phone) => {
    return await createAdmin(name, email, phone);
};

export const fetchAdminById = async (id) => {
    return await getAdminById(id);
};