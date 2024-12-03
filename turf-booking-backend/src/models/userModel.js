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