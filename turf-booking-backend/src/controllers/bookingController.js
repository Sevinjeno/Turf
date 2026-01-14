import { checkBookingConflict,  getBookingsByTurfAndDate, previewBookingPriceService, } from '../services/bookingService.js';

/**
 * Controller to create a booking.
 */
// export const createBookingController = async (req, res) => {
//   try {
//     const { turf_id, court_id, start_time, end_time } = req.body;
//     const user_id = req.user.id;

//     const booking = await createBookingService({
//       user_id,
//       turf_id,
//       court_id,
//       start_time,
//       end_time
//     });

//     res.status(201).json(booking);
//   } catch (err) {
//     if (err.message === "SLOT_CONFLICT") {
//       return res.status(409).json({ error: "Slot already booked" });
//     }

//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const getBookingsController = async (req, res) => {
//    const { turfId, date } = req.query;
//   try {
//     const bookings = await getBookingsByTurfAndDate(turfId, date);
//     if (bookings.length === 0) {
//       return res.status(404).json({ message: "No bookings found for this turf on the specified date." });
//     }
//     res.status(200).json(bookings);
//   } catch (err) {
//     console.error("Error fetching bookings:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// }

export const previewBookingController=async(req,res)=>{
   console.log("req",req.body)
   try{
   const price = await previewBookingPriceService (req.body)
   console.log("Price",price)
   res.status(200).json(price)
   }catch(err){
      res.status(400).json({error:err.message});
   }
}