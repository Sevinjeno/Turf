import pool from '../configs/dbConfig.js';

// Create Super Admin
export const createSuperAdmin = async (username, hashedPassword) => {
    const query = `
        INSERT INTO superadmins (username, password)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const values = [username, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Get Super Admin by username
export const getSuperAdminByUsername = async (username) => {
    const query = 'SELECT * FROM superadmins WHERE username = $1;';
    const result = await pool.query(query, [username]);
    return result.rows[0];
};