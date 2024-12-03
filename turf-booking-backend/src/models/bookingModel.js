import pool from '../configs/dbConfig.js';

// Create a booking
export const createBooking = async (userId, turfId, bookingTime, amount) => {
    const query = `
        INSERT INTO bookings (user_id, turf_id, booking_time, amount)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [userId, turfId, bookingTime, amount];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Get bookings by user
export const getBookingsByUser = async (userId) => {
    const query = 'SELECT * FROM bookings WHERE user_id = $1;';
    const result = await pool.query(query, [userId]);
    return result.rows;
};