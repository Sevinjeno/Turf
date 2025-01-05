import pool from '../configs/dbConfig.js';

export const createTurf = async (name, location, adminId, imageUrl) => {
    console.log("Create Turf");

    // Use ST_SetSRID and ST_Point to correctly format the geography data
    // INSERT INTO turfs (name, location, admin_id,"image_url")
    const query = `
        INSERT INTO turfs (name, location,"image_url")
        VALUES ($1, ST_SetSRID(ST_Point($2, $3), 4326), $4)
        RETURNING *;
    `;
    // Passing lat and lon separately
    // const values = [name, location.lon, location.lat, adminId, imageUrl];
    const values = [name, location.lon, location.lat, imageUrl];

    console.log("Val", values);
    console.log("query", query);

    try {
        const result = await pool.query(query, values);
        console.log("Turf created successfully:", result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error("Error creating turf:", error.message);
        console.error("Error details:", error);
        throw error;  // Re-throw the error to propagate it
    }
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