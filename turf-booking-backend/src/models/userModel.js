import pool from '../configs/dbConfig.js';

// Create a new user
export const createUser = async (name, email) => {
    const query = `
        INSERT INTO users (name, email)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const values = [name, email];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Get user by ID
export const getUserById = async (id) => {
    const query = 'SELECT * FROM users WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};


// Get user by email (for login)
export const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1;';
    const result = await pool.query(query, [email]);
    return result.rows[0];  // If user exists, return the user data, otherwise null
};

// Get all users
export const getAllUsers = async () => {
    const query = 'SELECT * FROM users;';
    const result = await pool.query(query);
    return result.rows;  // Return all user data
};
