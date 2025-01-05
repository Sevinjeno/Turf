import pool from '../configs/dbConfig.js';
import { createNewTurf, fetchTurfsByLocation } from '../services/turfService.js';

/**
 * Controller to handle creating a turf.
 */
export const createTurfController = async (req, res) => {
    const { name, location, adminId, imageUrl } = req.body;
    console.log(req.body)
console.log("oooo")
    // Check if turf with this name already exists
    try {
        const existingTurf = await pool.query(
            'SELECT * FROM turfs WHERE name = $1', [name]
        );

        if (existingTurf.rows.length > 0) {
            return res.status(400).json({ message: 'Turf already exists' });
        }

        // Create new turf if not found
        console.log("yes")
        const newTurf = await createNewTurf(name, location, adminId, imageUrl);
        res.status(201).json({ message: 'Turf created successfully', data: newTurf });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create turf', error: error.message });
    }
};

/**
 * Controller to get turfs by location.
 */
export const getTurfsByLocationController = async (req, res) => {
    const { location } = req.query;
    try {
        const turfs = await fetchTurfsByLocation(location);
        res.status(200).json({ data: turfs });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch turfs', error: error.message });
    }
};


export const getNearbyTurfs = async (req, res) => {
    const { lat, lon, radius } = req.query;

    try {
        const query = `
            SELECT 
                id, 
                name, 
                image_url,
                ST_X(location::geometry) AS longitude, 
                ST_Y(location::geometry) AS latitude, 
                ST_Distance(location, ST_SetSRID(ST_Point($2, $1), 4326)) AS distance
                FROM turfs
                WHERE ST_DWithin(location, ST_SetSRID(ST_Point($2, $1), 4326), $3)
                ORDER BY distance ASC;
        `;

        const { rows } = await pool.query(query, [lat, lon, radius]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching nearby turfs:', error);
        res.status(500).json({ error: 'Failed to fetch turfs' });
    }
};
