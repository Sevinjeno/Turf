import * as userModel from '../models/userModel.js';  // Assuming userModel functions interact with the database

// Register user (add a new user to the database)
export const registerUser = async (name, email, phone) => {
    try {
        const user = await userModel.createUser(name, email, phone);  // Create user model function
        return user;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};

// Fetch user by ID
export const fetchUserById = async (id) => {
    try {
        const user = await userModel.getUserById(id);  // Get user by ID function in userModel
        return user;
    } catch (error) {
        throw new Error('Error fetching user by ID: ' + error.message);
    }
};