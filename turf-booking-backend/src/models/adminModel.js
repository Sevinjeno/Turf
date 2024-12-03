import pool from '../configs/dbConfig.js';

export const createAdmin = async (name, email, phone) => {
    const query = `
        INSERT INTO admins (name, email, phone)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [name, email, phone];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getAdminById = async (id) => {
    const query = 'SELECT * FROM admins WHERE id = $1;';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
};