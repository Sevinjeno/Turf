import { createAdmin, getAdminByEmail, getAdminData, getAllAdmins } from '../models/adminModel.js';

export const registerAdmin = async (name, email, phone,password) => {
    return await createAdmin(name, email, phone,password);
};

export const fetchAdminByEmail = async (email) => {
    return await getAdminByEmail(email);
};

export const fetchAllAdmins = async (req, res) => {
    return await getAllAdmins()
};

export const fetchAdminData = async (id) => {
    return await getAdminData(id)
}