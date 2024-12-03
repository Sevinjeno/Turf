import { createNewBooking, fetchBookingsForUser } from '../services/bookingService.js';

/**
 * Controller to create a booking.
 */
export const createBookingController = async (req, res) => {
    const { userId, turfId, startTime, endTime } = req.body;
    try {
        const booking = await createNewBooking(userId, turfId, startTime, endTime);
        res.status(201).json({ message: 'Booking created successfully', data: booking });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create booking', error: error.message });
    }
};

/**
 * Controller to get bookings for a user.
 */
export const getBookingsForUserController = async (req, res) => {
    const { userId } = req.params;
    try {
        const bookings = await fetchBookingsForUser(userId);
        res.status(200).json({ data: bookings });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
};