import pool from '../configs/dbConfig.js';
import { createBooking, getBookingsByUser } from '../models/bookingModel.js';

export const createBookingService = async (user_id, turf_id, court_id, start_time, end_time) => {
  const result = await pool.query(
    `INSERT INTO bookings (user_id, turf_id, court_id, start_time, end_time, status)
     VALUES ($1, $2, $3, $4, $5, 'confirmed')
     RETURNING *`,
    [user_id, turf_id, court_id, start_time, end_time]
  );
  return result.rows[0];
};

export const checkBookingConflict = async (turf_id, court_id, start_time, end_time) => {
  const result = await pool.query(
    `SELECT * FROM bookings 
     WHERE turf_id = $1 
       AND court_id = $2
       AND status = 'confirmed'
       AND ((start_time, end_time) OVERLAPS ($3, $4))`,
    [turf_id, court_id, start_time, end_time]
  );
  return result.rowCount > 0;
};

export const getBookingsByTurfAndDate = async (turfId, date) => {
  try {
    const result = await pool.query(
      `SELECT 
         court_id,
         start_time AT TIME ZONE 'UTC' AS start_time, 
         end_time AT TIME ZONE 'UTC' AS end_time
       FROM bookings
       WHERE turf_id = $1 
       AND DATE(start_time AT TIME ZONE 'UTC') = $2 
       AND status = 'confirmed'`,
      [turfId, date]
    );

    return result.rows; // includes court_id now
  } catch (err) { 
    console.error(err);
    return [];
  }
};