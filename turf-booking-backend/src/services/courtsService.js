import pool from '../configs/dbConfig.js';



export const getCourtsByTurfId = async (turfId) => {
  const result = await pool.query(
    `SELECT id, name, is_active, created_at 
     FROM courts 
     WHERE turf_id = $1
     ORDER BY name ASC`,
    [turfId]
  );
  return result.rows;
};