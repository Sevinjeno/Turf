import pool from '../configs/dbConfig.js';


export const createTurf = async (name, location, imageUrl) => {
    const query = `
        INSERT INTO turfs (name, location, image_url)
        VALUES ($1, ST_SetSRID(ST_Point($2, $3), 4326), $4)
        RETURNING *;
    `;

    const values = [name, location.lon, location.lat, imageUrl];

    try {
        const turfResult = await pool.query(query, values);
        const turf = turfResult.rows[0];

        // Generate default time slots for the turf (e.g., 6 AM - 10 PM in 1-hour slots)
        const timeSlots = [];
        for (let hour = 6; hour < 22; hour++) {
            timeSlots.push([turf.id, `2024-03-07 ${hour}:00:00`, `2024-03-07 ${hour + 1}:00:00`]);
        }

        const timeSlotQuery = `
            INSERT INTO time_slots (turf_id, start_time, end_time) VALUES 
            ${timeSlots.map(() => `(?, ?, ?)`).join(", ")}
        `;

        await pool.query(timeSlotQuery, timeSlots.flat());

        return turf;
    } catch (error) {
        console.error("Error creating turf:", error);
        throw error;
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

export const getTurfById = async (id) => {
    const turfQuery = `
        SELECT id, name, image_url, 
               ST_X(location::geometry) AS longitude, 
               ST_Y(location::geometry) AS latitude
        FROM turfs
        WHERE id = $1;
    `;
    const timeSlotQuery = 'SELECT id, start_time, end_time, is_booked FROM time_slots WHERE turf_id = $1 ORDER BY start_time;';

    try {
        const turfResult = await pool.query(turfQuery, [id]);
        if (turfResult.rows.length === 0) return null;

        const timeSlotResult = await pool.query(timeSlotQuery, [id]);

        return {
            ...turfResult.rows[0],
            time_slots: timeSlotResult.rows
        };
    } catch (error) {
        console.error("Error fetching turf details:", error);
        throw error;
    }
};