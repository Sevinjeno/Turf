import pool from '../configs/dbConfig.js';

export const createAdmin = async (name, email, phone,password) => {
    const query = `
        INSERT INTO admins (name, email, phone,password)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [name, email, phone, password];
    const result = await pool.query(query, values);
    console.log("Result ",result)
    return result.rows[0];
};

export const getAdminById = async (id) => {
    const query = 'SELECT * FROM admins WHERE id = $1;';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getAllAdmins = async () => {
    const query = "SELECT id, email, name, phone FROM admins;";
    const result = await pool.query(query);
    return result.rows;
};