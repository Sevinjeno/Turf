import pool from '../configs/dbConfig.js';
import { insertBooking } from '../models/bookingModel.js';
import { getPlatformFeePercent } from '../models/platformSettings.model.js';
import { getTurfById } from '../models/turfModel.js';
import { validateBookingDuration } from '../utils/ValidateBookingGenerations.js';

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


export const checkBookingConflict = async (
  turf_id,
  court_id,
  start_time,
  end_time
) => {
  // 1. Load the requested court
  const { rows } = await pool.query(
    `SELECT id, type, parent_court_id
     FROM courts
     WHERE id = $1 AND turf_id = $2`,
    [court_id, turf_id]
  );

  if (rows.length === 0) {
    throw new Error("COURT_NOT_FOUND");
  }

  const court = rows[0];
  const courtsToCheck = new Set();

  // Always check itself
  courtsToCheck.add(court.id);

  // 2. Expand conflict scope
  if (court.type === "FULL") {
    // FULL → check all HALFs
    const { rows: children } = await pool.query(
      `SELECT id FROM courts WHERE parent_court_id = $1`,
      [court.id]
    );

    children.forEach(c => courtsToCheck.add(c.id));
  }

  if (court.type === "HALF" && court.parent_court_id) {
    // HALF → check its FULL
    courtsToCheck.add(court.parent_court_id);
  }

  // 3. Check conflicts
  const result = await pool.query(
    `SELECT 1 FROM bookings
     WHERE turf_id = $1
       AND court_id = ANY($2)
       AND status = 'confirmed'
       AND (start_time, end_time) OVERLAPS ($3, $4)
     LIMIT 1`,
    [turf_id, Array.from(courtsToCheck), start_time, end_time]
  );

  return result.rowCount > 0;
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
  // 1. Validate turf exists (ownership & safety)
  const turf = await getTurfById(turf_id);
  if (!turf) throw new Error("TURF_NOT_FOUND");

  // 2. Fetch court
  const court = await getCourtById(court_id);
  if (!court) throw new Error("COURT_NOT_FOUND");

  // 3. Ensure court belongs to turf
  if (court.turf_id !== turf_id) {
    throw new Error("COURT_TURF_MISMATCH");
  }

  // 4. Validate duration
  const { durationHours } = validateBookingDuration(
    new Date(start_time),
    new Date(end_time)
  );

  // 5. Pricing (court-based)
  const basePrice = Number(court.price) * durationHours;

  // 6. Platform fee
  const platformFeePercent = await getPlatformFeePercent();

  // 7. Final breakdown
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

export const confirmBookingAfterPaymentService = async ({
  user_id,
  turf_id,
  court_id,
  start_time,
  end_time,
  payment_id,
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
  });
  return insertBooking({
    user_id,
    turf_id,
    court_id,
    start_time,
    end_time,
    status: "confirmed",
    payment_id,
    base_price: price.totalBaseAmount,
    platform_fee: price.platformFee,
    total_amount: price.totalAmount,
    admin_earning: price.adminEarning,
  });
};

export const getAvailableCourtsService = async ({
  turf_id,
  start_time,
  end_time,
}) => {
  // 1. Fetch all courts
  const { rows: courts } = await pool.query(
    `SELECT id, name, type, price, parent_court_id
     FROM courts
     WHERE turf_id = $1`,
    [turf_id]
  );

  // 2. Fetch overlapping confirmed bookings
  const { rows: bookings } = await pool.query(
    `SELECT court_id
     FROM bookings
     WHERE turf_id = $1
       AND status = 'confirmed'
       AND NOT (end_time <= $2 OR start_time >= $3)`,
    [turf_id, start_time, end_time]
  );

  const bookedCourtIds = new Set(bookings.map(b => b.court_id));

  // 3. Build lookup maps
  const courtById = new Map();
  const childrenByParent = new Map();

  for (const court of courts) {
    courtById.set(court.id, court);

    if (court.parent_court_id) {
      if (!childrenByParent.has(court.parent_court_id)) {
        childrenByParent.set(court.parent_court_id, []);
      }
      childrenByParent.get(court.parent_court_id).push(court.id);
    }
  }

  // 4. Expand blocked courts
  const blockedCourtIds = new Set();

  for (const courtId of bookedCourtIds) {
    blockedCourtIds.add(courtId);

    const court = courtById.get(courtId);

    if (!court) continue;

    // If FULL booked → block all HALFs
    if (court.type === "FULL") {
      const children = childrenByParent.get(court.id) || [];
      children.forEach(id => blockedCourtIds.add(id));
    }

    // If HALF booked → block its FULL
    if (court.type === "HALF" && court.parent_court_id) {
      blockedCourtIds.add(court.parent_court_id);
    }
  }

  // 5. Return available courts
  return courts.filter(court => !blockedCourtIds.has(court.id));
};
