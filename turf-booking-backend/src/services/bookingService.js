import pool from '../configs/dbConfig.js';
import { insertBooking } from '../models/bookingModel.js';
import { getPlatformFeePercent } from '../models/platformSettings.model.js';
import { getTurfById } from '../models/turfModel.js';
import { validateBookingDuration } from '../utils/ValidateBookingGenerations.js';

// Unit = real physical thing (Net / Pitch / Half / Lane)

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
//! IMPORTANT:
// - Minimum booking = 1 hour
// - Extensions only in 30-minute blocks
// - Price calculated here, never in frontend


// flow - >

// Preview (calculation only)

// Payment (external system)

// Booking (DB write)

//calculate Booking Price


// export const checkBookingConflict = async (
//   turf_id,
//   court_id,
//   start_time,
//   end_time
// ) => {
//   // 1. Load the requested court
//   const { rows } = await pool.query(
//     `SELECT id, type, parent_court_id
//      FROM courts
//      WHERE id = $1 AND turf_id = $2`,
//     [court_id, turf_id]
//   );

//   if (rows.length === 0) {
//     throw new Error("COURT_NOT_FOUND");
//   }

//   const court = rows[0];
//   const courtsToCheck = new Set();

//   // Always check itself
//   courtsToCheck.add(court.id);

//   // 2. Expand conflict scope
//   if (court.type === "FULL") {
//     // FULL → check all HALFs
//     const { rows: children } = await pool.query(
//       `SELECT id FROM courts WHERE parent_court_id = $1`,
//       [court.id]
//     );

//     children.forEach(c => courtsToCheck.add(c.id));
//   }

//   if (court.type === "HALF" && court.parent_court_id) {
//     // HALF → check its FULL
//     courtsToCheck.add(court.parent_court_id);
//   }

//   // 3. Check conflicts
//   const result = await pool.query(
//     `SELECT 1 FROM bookings
//      WHERE turf_id = $1
//        AND court_id = ANY($2)
//        AND status = 'confirmed'
//        AND (start_time, end_time) OVERLAPS ($3, $4)
//      LIMIT 1`,
//     [turf_id, Array.from(courtsToCheck), start_time, end_time]
//   );

//   return result.rowCount > 0;
// };

export const checkBookingConflict = async (
  turf_id,
  court_id,
  start_time,
  end_time
) => {
  // 1. Load requested court
  const { rows } = await pool.query(
    `
    SELECT id, type, parent_court_id
    FROM courts
    WHERE id = $1 AND turf_id = $2
    `,
    [court_id, turf_id]
  );

  if (!rows.length) throw new Error("COURT_NOT_FOUND");

  const court = rows[0];
  const courtsToCheck = new Set();

  // Always block itself
  courtsToCheck.add(court.id);

  // FULL blocks all HALFs
  if (court.type === "FULL") {
    const { rows: halves } = await pool.query(
      `SELECT id FROM courts WHERE parent_court_id = $1`,
      [court.id]
    );
    halves.forEach(h => courtsToCheck.add(h.id));
  }

  // HALF blocks its FULL
  if (court.type === "HALF" && court.parent_court_id) {
    courtsToCheck.add(court.parent_court_id);
  }

  // 2. Check overlaps
  const conflict = await pool.query(
    `
    SELECT 1
    FROM bookings
    WHERE turf_id = $1
      AND court_id = ANY($2)
      AND status = 'confirmed'
      AND (start_time, end_time) OVERLAPS ($3, $4)
    LIMIT 1
    `,
    [turf_id, Array.from(courtsToCheck), start_time, end_time]
  );

  return conflict.rowCount > 0;
};





export const calculateBookingPrice=({
  basePrice,
  platformFeePercent
}
)=>{

console.log("basePrice",basePrice)

console.log("platformFeePercent",platformFeePercent)

 
  const platformFee=Math.round((basePrice * platformFeePercent )/100);

  const totalAmount=basePrice + platformFee;
console.log("platformFee",platformFee)
  return{
    basePrice,
    platformFee,
    totalAmount,
    adminEarning:basePrice,
  }


}

export const previewBookingPriceService = async ({
  turf_id,
  court_id,
  start_time,
  end_time,
}) => {
  // 1. Validate turf
  console.log( turf_id,
  court_id,
  start_time,
  end_time,)
  const turf = await getTurfById(turf_id);
  if (!turf) throw new Error("TURF_NOT_FOUND");

  // 2. Validate duration
  const { durationHours } = validateBookingDuration(
    new Date(start_time),
    new Date(end_time)
  );

  // 3. Load court + price
  const { rows } = await pool.query(
    `
    SELECT id, price_per_hour
    FROM courts
    WHERE id = $1 AND turf_id = $2 AND is_active = true
    `,
    [court_id, turf_id]
  );

  if (!rows.length) throw new Error("COURT_NOT_FOUND");

  const court = rows[0];

  console.log("Courts",court)

  // 4. Calculate price
  const basePrice = Number(court.price_per_hour) * durationHours;

  const platformFeePercent = await getPlatformFeePercent();

  return calculateBookingPrice({
    basePrice,
    platformFeePercent,
  });
};





export const cancelBookingService = async (bookingId, userId) => {
  const { rows } = await pool.query(
    `SELECT * FROM bookings
     WHERE id=$1 AND user_id=$2 AND status='confirmed'`,
    [bookingId, userId]
  );

  if (!rows.length) throw new Error("BOOKING_NOT_FOUND");

  const booking = rows[0];

  const hoursBefore =
    (new Date(booking.start_time) - new Date()) / 36e5;

  let refund_amount = 0;

  if (hoursBefore >= 24) {
    refund_amount = booking.total_amount - booking.platform_fee;
  }

  await pool.query(
    `
    UPDATE bookings
    SET status='cancelled',
        refund_amount=$1
    WHERE id=$2
    `,
    [refund_amount, bookingId]
  );

  return { refund_amount };
};


export const confirmBookingService = async ({
  user_id,
  turf_id,
  court_id,
  start_time,
  end_time,
}) => {
  const conflict = await checkBookingConflict(
    turf_id,
    court_id,
    start_time,
    end_time
  );

  if (conflict) throw new Error("SLOT_CONFLICT");

  const price = await previewBookingPriceService({
    turf_id,
    start_time,
    end_time,
    court_id,
  });

  const booking = await insertBooking({
    user_id,
    turf_id,
    court_id,
    start_time,
    end_time,
    status: "confirmed",
    base_price: price.basePrice,
    platform_fee: price.platformFee,
    total_price: price.totalAmount,
    admin_earning: price.adminEarning,
  });

  return booking;
};


//todo After doing the payment 
// export const confirmBookingAfterPaymentService = async ({
//   user_id,
//   turf_id,
//   court_id,
//   start_time,
//   end_time,
//   payment_id,
// }) => {
//   // 1. Conflict check
//   const conflict = await checkBookingConflict(
//     turf_id,
//     court_id,
//     start_time,
//     end_time
//   );
//   if (conflict) throw new Error("SLOT_CONFLICT");

//   // 2. Price calculation
//   const price = await previewBookingPriceService({
//     turf_id,
//     court_id,
//     start_time,
//     end_time,
//   });

//   // 3. Insert booking
//   const booking = await insertBooking({
//     user_id,
//     turf_id,
//     court_id,
//     start_time,
//     end_time,
//     status: "confirmed",
//     payment_id,
//     base_price: price.basePrice,
//     platform_fee: price.platformFee,
//     total_amount: price.totalAmount,
//     admin_earning: price.adminEarning,
//   });

//   return booking;
// };



export const getAvailableCourtsService = async ({
  turf_id,
  start_time,
  end_time,
}) => {
  const { rows: courts } = await pool.query(
    `
    SELECT id, name, type, parent_court_id
    FROM courts
    WHERE turf_id = $1 AND is_active = true
    `,
    [turf_id]
  );

  const { rows: bookings } = await pool.query(
    `
    SELECT court_id, start_time, end_time
    FROM bookings
    WHERE turf_id = $1
      AND status = 'confirmed'
      AND (start_time, end_time) OVERLAPS ($2, $3)
    `,
    [turf_id, start_time, end_time]
  );

  const blocked = new Set(bookings.map(b => b.court_id));

  return courts.map(c => ({
    ...c,
    available: !blocked.has(c.id),
  }));
};


// ! Later after scaling for badminton we will use Units
export const getAvailableUnitsService = async ({
  turf_id,
  start_time,
  end_time,
}) => {
  // 1. All units
  const { rows: units } = await pool.query(
    `SELECT id, name, price FROM units WHERE turf_id = $1`,
    [turf_id]
  );

  // 2. Booked units in that time
  const { rows: booked } = await pool.query(
    `
    SELECT DISTINCT bu.unit_id
    FROM bookings b
    JOIN booking_units bu ON bu.booking_id = b.id
    WHERE b.turf_id = $1
      AND b.status = 'confirmed'
      AND (b.start_time, b.end_time) OVERLAPS ($2, $3)
    `,
    [turf_id, start_time, end_time]
  );

  const bookedSet = new Set(booked.map(b => b.unit_id));

  // 3. Return free units
  return units.filter(u => !bookedSet.has(u.id));
};



