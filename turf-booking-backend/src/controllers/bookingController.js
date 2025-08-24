import { checkBookingConflict, createBookingService, getBookingsByTurfAndDate, } from '../services/bookingService.js';

/**
 * Controller to create a booking.
 */
export const createBookingController = async (req, res) => {
  const { turf_id, court_id, start_time, end_time, user_id } = req.body;
  try {
    const hasConflict = await checkBookingConflict(turf_id, court_id, start_time, end_time);
    if (hasConflict) {
      return res.status(409).json({ error: "Slot already booked" });
    }
    const newBooking = await createBookingService(user_id, turf_id, court_id, start_time, end_time);
    res.status(201).json(newBooking);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBookingsController = async (req, res) => {
   const { turfId, date } = req.query;
  try {
    const bookings = await getBookingsByTurfAndDate(turfId, date);
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this turf on the specified date." });
    }
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Server error" });
  }
}