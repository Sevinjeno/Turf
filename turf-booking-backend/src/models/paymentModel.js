import pool from '../configs/dbConfig.js';

export const createPayment = async (bookingId, amount, paymentType, status = 'pending') => {
    const query = `
        INSERT INTO payments (booking_id, amount, payment_type, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [bookingId, amount, paymentType, status];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getPaymentByBookingId = async (bookingId) => {
    const query = 'SELECT * FROM payments WHERE booking_id = $1;';
    const values = [bookingId];
    const result = await pool.query(query, values);
    return result.rows[0];
};