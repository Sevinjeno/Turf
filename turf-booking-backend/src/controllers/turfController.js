import { createNewTurf, fetchTurfsByLocation } from '../services/turfService.js';

/**
 * Controller to handle creating a turf.
 */
export const createTurfController = async (req, res) => {
    const { name, location, adminId, imageUrl } = req.body;
    try {
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
            SELECT id, name, location, 
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