import express from 'express';
import { createBookingController, getBookingsForUserController } from '../controllers/bookingController.js';

const router = express.Router();

// Route for creating a booking
router.post('/', createBookingController);

// Route for fetching bookings for a user
router.get('/user/:userId', getBookingsForUserController);

export default router;