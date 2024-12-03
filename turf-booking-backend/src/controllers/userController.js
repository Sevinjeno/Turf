import { registerUser, fetchUserById } from '../services/userService.js';

/**
 * Controller to handle user registration.
 */
export const createUserController = async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const newUser = await registerUser(name, email, phone);
        res.status(201).json({ message: 'User created successfully', data: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
};

/**
 * Controller to get a user by ID.
 */
export const getUserController = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await fetchUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
};