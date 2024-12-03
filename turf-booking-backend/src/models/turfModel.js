import pool from '../configs/dbConfig.js';

export const createTurf = async (name, location, adminId, imageUrl) => {
    const query = `
        INSERT INTO turfs (name, location, admin_id, image_url)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [name, location, adminId, imageUrl];
    const result = await pool.query(query, values);
    return result.rows[0];
};


// Fetch all turfs
export const getAllTurfs = async () => {
    const query = 'SELECT * FROM turfs;';
    const result = await pool.query(query);
    return result.rows;
};

// Fetch turfs by location
export const getTurfsByLocation = async (location) => {
    const query = `
        SELECT * 
        FROM turfs 
        WHERE location ILIKE $1;
    `;
    const values = [`%${location}%`];
    const result = await pool.query(query, values);
    return result.rows;
};