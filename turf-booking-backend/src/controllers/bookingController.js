import { checkBookingConflict,  confirmBookingService,  getBookingsByTurfAndDate, previewBookingPriceService, } from '../services/bookingService.js';

/**
 * Controller to create a booking.
 */
export const createBookingController = async (req, res) => {
  try {
    console.log("confirmBookingService Rqest ",req.body)
    const booking = await confirmBookingService(req.body);
    console.log("booking",booking)
    res.json(booking);
  } catch (err) {
    console.log("I error ",err)
    res.status(400).json({ error: err.message });
  }
};

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