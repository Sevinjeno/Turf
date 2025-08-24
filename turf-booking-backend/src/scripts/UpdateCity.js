import axios from 'axios';

import pkg from 'pg';
const { Pool } = pkg; //for pool , I did this because pg is  commonjs module , which was conflicting with the es6 modules
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

export default pool;


export const getCityFromCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          format: "json",
          lat,
          lon,
        },
        headers: {
          "User-Agent": "your-turf-booking-app" // Required
        }
      }
    );

    return response.data.address.city || response.data.address.town || response.data.address.village;
  } catch (error) {
    console.error("Nominatim Error:", error.message);
    return null;
  }
};

const updateAllTurfCities = async () => {
  const client = await pool.connect();
  try {

    const res = await client.query(`
      SELECT id, ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon
      FROM turfs
      WHERE city IS NULL
    `);

    for (const row of res.rows) {
      const { id, lat, lon } = row;
      const city = await getCityFromCoordinates(lat, lon);

      if (city) {
        await client.query('UPDATE turfs SET city = $1 WHERE id = $2', [city, id]);
      } else {
        console.warn(`⚠️  Could not find city for turf ID ${id}`);
      }
    }

  } catch (error) {
    console.error("❌ Error updating turfs:", error);
  } finally {
    client.release();
    process.exit(0);
  }
};

// ✅ 4. Run the update
updateAllTurfCities();