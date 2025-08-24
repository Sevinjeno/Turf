import multer from 'multer';
import pool from '../configs/dbConfig.js';
import { createNewTurf, fetchTurfsByLocation , fetchTurfById, getBookingsForDate, generateSlots, fetchTurfbyAdminId, updateTurfService } from '../services/turfService.js';



// Set up file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

export const uploads = multer({ storage });

/**
 * Controller to handle creating a turf.
 */
export const createTurfController = async (req, res) => {
    const { name, lat, lon, adminId, startTime, endTime, price,courts,city } = req.body;
console.log("Controller courts",courts)
    const location = {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    };


    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imageUrl = `/uploads/${imageFile.filename}`; // you can serve this via static path
    try {
        const existingTurf = await pool.query(
            'SELECT * FROM turfs WHERE name = $1', [name]
        );

        if (existingTurf.rows.length > 0) {
            return res.status(400).json({ message: 'Turf already exists' });
        }

        // Create new turf if not found
        const newTurf = await createNewTurf(name, location, adminId, imageUrl,startTime, endTime, price,courts,city);
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

export const getAllTurfs = async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        name, 
        image_url,
        ST_X(location::geometry) AS longitude, 
        ST_Y(location::geometry) AS latitude
      FROM turfs;
    `;

    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching all turfs:', error);
    res.status(500).json({ error: 'Failed to fetch turfs' });
  }
};

export const getTurfByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const turf = await fetchTurfById(id);
        res.json(turf);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getTurfsByAdminIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const turfs = await fetchTurfbyAdminId(id);
        res.status(200).json({ data: turfs });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch turfs', error: error.message });
    }
}

export const updateTurfController = async (req, res) => {
  const { id } = req.params;
  const turfData = req.body;
  try {
    const updatedTurf = await updateTurfService(id, turfData);

    if (updatedTurf.length === 0) {
      return res.status(404).json({ message: "Turf not found" });
    }

    res.status(200).json({
      message: "Turf updated successfully",
      data: updatedTurf[0],
    });
  } catch (error) {
    console.error("Error updating turf:", error);
    res.status(500).json({
      message: "Failed to update turf",
      error: error.message,
    });
  }
};

//? slots logic Main

//? we generate slots on the fly using this data
export const getAvailableSlots = async (req, res) => {
  const turfId = req.params.id;
  const date = req.query.date;

  if (!date) return res.status(400).json({ error: "Date is required" });

  try {
    const turf = await fetchTurfById(turfId);
    if (!turf) return res.status(404).json({ error: "Turf not found" });

    const bookings = await getBookingsForDate(turfId, date);
    const slots = generateSlots(turf, bookings, date);

    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

