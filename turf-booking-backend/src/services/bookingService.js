import pool from '../configs/dbConfig.js';
import { insertBooking } from '../models/bookingModel.js';
import { getPlatformFeePercent } from '../models/platformSettings.model.js';
import { getTurfById } from '../models/turfModel.js';

//! IMPORTANT:
// - Minimum booking = 1 hour
// - Extensions only in 30-minute blocks
// - Price calculated here, never in frontend

// export const createBookingService = async (user_id, turf_id, court_id, start_time, end_time) => {
//   const result = await pool.query(
//     `INSERT INTO bookings (user_id, turf_id, court_id, start_time, end_time, status)
//      VALUES ($1, $2, $3, $4, $5, 'confirmed')
//      RETURNING *`,
//     [user_id, turf_id, court_id, start_time, end_time]
//   );
//   return result.rows[0];
// };

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



export const createBookingService = async ({
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
  
  const start = new Date(start_time);
  const end = new Date(end_time);

  // 1. Enforce duration rules
  const durationMinutes = validateBookingDuration(start, end);

  const durationHours = durationMinutes / 60;

  const turf = await getTurfById(turf_id);
  if (!turf) throw new Error("TURF_NOT_FOUND");
  const platformFeePercent = await getPlatformFeePercent();

  const totalBaseAmount = turf.price * durationHours;

  const price = calculateBookingPrice({
    totalBaseAmount,
    platformFeePercent,
  });

  return insertBooking({
    user_id,
    turf_id,
    court_id,
    start_time,
    end_time,
    status: "confirmed",
    base_price: price.baseAmount,
    platform_fee: price.platformFee,
    total_amount: price.totalAmount,
    admin_earning: price.adminEarning,
    platform_earning: price.platformEarning,
  });
};


//calculate Booking Price

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
  const platformFeePercent = await getPlatformFeePercent();


  // const durationInHours =
  //   (new Date(end_time) - new Date(start_time)) / (1000 * 60 * 60);

  // if (durationInHours <= 0) {
  //   throw new Error("INVALID_DURATION");
  // }

  return calculateBookingPrice({
    basePrice: turf.price,
    platformFeePercent,
    // durationInHours,
  });
};