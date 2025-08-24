export const createTimeSlotService = async (turfId, data) => {
  const {
    start_time,
    end_time,
    price,
    is_blocked = false,
    is_event = false,
    event_title = null,
  } = data;

  const result = await pool.query(
    `INSERT INTO slots (turf_id, start_time, end_time, price, is_blocked, is_event, event_title, created_by_admin)
     VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
     RETURNING *`,
    [turfId, start_time, end_time, price, is_blocked, is_event, event_title]
  );

  return result.rows[0];
};