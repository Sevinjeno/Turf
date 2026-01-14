import pool from '../configs/dbConfig.js';
import { insertBooking } from '../models/bookingModel.js';
import { getPlatformFeePercent } from '../models/platformSettings.model.js';
import { getTurfById } from '../models/turfModel.js';

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



export const calculateBookingPrice=({
  basePrice,
  platformFeePercent
}
)=>{
 
  const platformFee=Math.round((basePrice * platformFeePercent )/100);

  const totalAmount=basePrice + platformFee;

  return{
    basePrice,
    platformFee,
    totalAmount,
    adminEarning:basePrice,
    platformEarning:platformFee
  }


}

// Preview Price 
export const previewBookingPriceService = async ({
  turf_id,
  start_time,
  end_time,
}) => {
  const turf = await getTurfById(turf_id);
  if (!turf) throw new Error("TURF_NOT_FOUND");

  const { durationHours } = validateBookingDuration(
    new Date(start_time),
    new Date(end_time)
  );

  const platform_fee_percent = await getPlatformFeePercent();

  const base_amount = turf.price * durationHours;

  return calculateBookingPrice({
    base_amount,
    platform_fee_percent,
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
    platform_earning: price.platformEarning,
  });
};