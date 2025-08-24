import pool from "../configs/dbConfig.js";
import { getCityFromCoordinates } from "../utils/GeoCoding.js";

export const createTurf = async (
  name,
  location,
  adminId,
  imageUrl,
  startTime,
  endTime,
  price,
  courts,
  city
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // ✅ start transaction

    if (!city) {
      city = await getCityFromCoordinates(location.lat, location.lon);
    }

    const query = `
      INSERT INTO turfs (
        name, location, admin_id, image_url, start_time, end_time, price, courts, city
      )
      VALUES (
        $1, ST_SetSRID(ST_Point($2, $3), 4326), $4, $5, $6, $7, $8, $9, $10
      )
      RETURNING *;
    `;

    const values = [
      name,
      location.lon,
      location.lat,
      adminId,
      imageUrl,
      startTime,
      endTime,
      price,
      courts,
      city,
    ];
console.log("values",values)
    const result = await client.query(query, values);
    const newTurf = result.rows[0];

    // ✅ insert courts dynamically
    for (let i = 1; i <= courts; i++) {
      await client.query(
        `INSERT INTO courts (turf_id, name) VALUES ($1, $2) RETURNING *`,
        [newTurf.id, `Court ${i}`]
      );
    }
console.log("courts",courts)
    await client.query("COMMIT"); // ✅ commit only if all succeeded
    return newTurf;

  } catch (error) {
    await client.query("ROLLBACK"); // ❌ rollback all inserts
    console.error("Error creating turf:", error);
    throw error;

  } finally {
    client.release(); // ✅ release client back to pool
  }
};



// Fetch all turfs
export const getAllTurfs = async () => {
  const query = "SELECT * FROM turfs;";
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
        SELECT *
        FROM turfs
        WHERE id = $1;
    `;

  try {
    const turfResult = await pool.query(turfQuery, [id]);

    if (turfResult.rows.length === 0) return null;

    return turfResult.rows[0];
  } catch (error) {
    console.error("Error fetching turf details:", error);
    throw error;
  }
};

export const getTurfsByAdminId = async (adminId) => {
  const query = `
    SELECT 
      id, 
      name, 
      image_url,
      ST_X(location::geometry) AS longitude, 
      ST_Y(location::geometry) AS latitude,
      start_time,
      end_time,
      price
    FROM turfs
    WHERE admin_id = $1;
  `;
  const { rows } = await pool.query(query, [adminId]);
  return rows;
};

export const updateTurfInDB = async (
  id,
  name,
  lat,
  lon,
  startTime,
  endTime,
  price,
  courts,
  city
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Update turf details
    const updateTurfQuery = `
      UPDATE turfs
      SET 
        name = $1,
        location = ST_SetSRID(ST_Point($2, $3), 4326),
        start_time = $4,
        end_time = $5,
        price = $6,
        courts = $7,
        city = $8
      WHERE id = $9
      RETURNING *;
    `;

    const turfValues = [
      name,
      lon,
      lat,
      startTime,
      endTime,
      price,
      courts,
      city,
      id,
    ];

    const { rows: turfRows } = await client.query(updateTurfQuery, turfValues);
    const updatedTurf = turfRows[0];

    // 2️⃣ Fetch existing courts
    const { rows: existingCourts } = await client.query(
      `SELECT * FROM courts WHERE turf_id = $1 ORDER BY id ASC`,
      [id]
    );

    const existingCount = existingCourts.filter(c => c.is_active).length;

    if (courts > existingCount) {
      // 3️⃣ Add new courts
      const newCourts = courts - existingCount;
      for (let i = 1; i <= newCourts; i++) {
        await client.query(
          `INSERT INTO courts (turf_id, name, is_active) VALUES ($1, $2, true)`,
          [id, `Court ${existingCourts.length + i}`]
        );
      }
    } else if (courts < existingCount) {
      // 4️⃣ Deactivate extra courts (don’t delete!)
      const courtsToDeactivate = existingCourts.slice(courts); // keep first N, deactivate rest
      for (const court of courtsToDeactivate) {
        await client.query(
          `UPDATE courts SET is_active = false WHERE id = $1`,
          [court.id]
        );
      }
    }

    await client.query("COMMIT");
    return updatedTurf;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
