import pool from '../configs/dbConfig.js';

// Create a time slot
export const createTimeSlot = async (turf_id, start_time, end_time, date) => {
    const query = `
        INSERT INTO time_slots (turf_id, start_time, end_time, date) 
        VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [turf_id, start_time, end_time, date];

    const result = await pool.query(query, values);
    return result.rows[0];
};

// Get available slots for a turf on a specific date
export const getAvailableSlots = async (turf_id, date) => {
    const query = `SELECT * FROM time_slots WHERE turf_id = $1 AND date = $2 AND is_booked = false`;
    const result = await pool.query(query, [turf_id, date]);
    return result.rows;
};

// Book a slot
export const bookTimeSlot = async (id) => {
    const query = `UPDATE time_slots SET is_booked = true WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

//Running only ones
export const generateInitialSlots = async () => {
    const today = new Date();
    const turfs = await pool.query("SELECT id FROM turfs"); // Get all turf IDs
    let queries = [];

    for (let i = 0; i < 90; i++) {
        const slotDate = new Date(today);
        slotDate.setDate(today.getDate() + i); // Each day for 90 days
        const formattedDate = slotDate.toISOString().split("T")[0];

        for (const { id: turf_id } of turfs.rows) {
            let startTime = new Date("2025-01-01T00:00:00"); // Start at 12 AM
            const endTime = new Date("2025-01-01T23:30:00"); // End at 11:30 PM

            while (startTime < endTime) {
                const slotStart = startTime.toTimeString().split(" ")[0];
                startTime.setMinutes(startTime.getMinutes() + 30);
                const slotEnd = startTime.toTimeString().split(" ")[0];

                const query = `
                    INSERT INTO time_slots (turf_id, start_time, end_time, date, is_booked)
                    VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING;
                `;
                queries.push(pool.query(query, [turf_id, slotStart, slotEnd, formattedDate, false]));
            }
        }
    }

    await Promise.all(queries);
    console.log(`✅ Successfully added 90 days of slots for all turfs`);
};

export const addNewDaySlots = async () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Add one new day
    const formattedDate = today.toISOString().split("T")[0];

    const turfs = await pool.query("SELECT id FROM turfs"); // Get all turf IDs
    let queries = [];

    for (const { id: turf_id } of turfs.rows) {
        let startTime = new Date("2025-01-01T00:00:00"); // Start at 12 AM
        const endTime = new Date("2025-01-01T23:30:00"); // End at 11:30 PM

        while (startTime < endTime) {
            const slotStart = startTime.toTimeString().split(" ")[0];
            startTime.setMinutes(startTime.getMinutes() + 30);
            const slotEnd = startTime.toTimeString().split(" ")[0];

            const query = `
                INSERT INTO time_slots (turf_id, start_time, end_time, date, is_booked)
                VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING;
            `;
            queries.push(pool.query(query, [turf_id, slotStart, slotEnd, formattedDate, false]));
        }
    }

    await Promise.all(queries);
    console.log(`✅ Added new slots for ${formattedDate}`);
};

// Deletes slots older than 2 days before yesterday.
export const cleanupOldSlots = async () => {
    const cleanupDate = new Date();
    cleanupDate.setDate(cleanupDate.getDate() - 2); // Two days before yesterday
    const formattedCleanupDate = cleanupDate.toISOString().split("T")[0];

    const query = `DELETE FROM time_slots WHERE date <= $1;`;
    await pool.query(query, [formattedCleanupDate]);

    console.log(`🗑 Deleted slots before ${formattedCleanupDate}`);
};

// ✅ Book recurring slots (e.g., every Monday & Wednesday for 6 months)
export const bookMonthlyPackage = async (turf_id, user_id, start_time, end_time, weekdays, months) => {
    const today = new Date();
    let queries = [];

    for (let i = 0; i < months * 4; i++) {
        const slotDate = new Date(today);
        slotDate.setDate(today.getDate() + i * 7); // Weekly interval
        const formattedDate = slotDate.toISOString().split("T")[0];

        if (weekdays.includes(slotDate.getDay())) {
            const query = `
                INSERT INTO time_slots (turf_id, user_id, start_time, end_time, date, is_booked)
                VALUES ($1, $2, $3, $4, $5, true) ON CONFLICT DO NOTHING;
            `;
            queries.push(pool.query(query, [turf_id, user_id, start_time, end_time, formattedDate]));
        }
    }

    await Promise.all(queries);
    console.log(`✅ Monthly booking confirmed for user ${user_id} at Turf ${turf_id}`);
};


