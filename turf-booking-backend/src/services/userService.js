import * as userModel from '../models/userModel.js';

// Register user (by name, email, phone, or Google ID)
export const registerUser = async (userData) => {
    try {
        const user = await userModel.createUser(userData);
        return user;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};

// Fetch user by ID
export const fetchUserById = async (id) => {
    try {
        const user = await userModel.getUserById(id);
        return user;
    } catch (error) {
        throw new Error('Error fetching user by ID: ' + error.message);
    }
};

// Fetch user by email
export const fetchUserByEmail = async (email) => {
    try {
        const user = await userModel.getUserByEmail(email);
        return user;
    } catch (error) {
        throw new Error('Error fetching user by email: ' + error.message);
    }
};

// Fetch user by phone
export const fetchUserByPhone = async (phone) => {
    try {
        const user = await userModel.getUserByPhone(phone);
        return user;
    } catch (error) {
        throw new Error('Error fetching user by phone: ' + error.message);
    }
};

// Fetch user by Google ID
export const fetchUserByGoogleId = async (googleId) => {
    try {
        const user = await userModel.getUserByGoogleId(googleId);
        return user;
    } catch (error) {
        throw new Error('Error fetching user by Google ID: ' + error.message);
    }
};

// Fetch all users
export const fetchAllUsers = async () => {
    try {
        const users = await userModel.getAllUsers();
        return users;
    } catch (error) {
        throw new Error('Error fetching all users: ' + error.message);
    }
};
