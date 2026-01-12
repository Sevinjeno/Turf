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

export const insertBooking = async ({
  user_id,
  turf_id,
  court_id,
  slot_id,
  start_time,
  end_time,
  base_price,
  admin_earning,
  platform_earning,
  total_amount
}) => {
  const query = `
    INSERT INTO bookings (
      user_id,
      turf_id,
      court_id,
      slot_id,
      start_time,
      end_time,
      status,
      base_price,
      admin_earning,
      platform_earning,
      total_amount
    )
    VALUES ($1,$2,$3,$4,$5,$6,'confirmed',$7,$8,$9,$10)
    RETURNING *;
  `;

  const values = [
    user_id,
    turf_id,
    court_id,
    slot_id,
    start_time,
    end_time,
    base_price,
    admin_earning,
    platform_earning,
    total_amount
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};