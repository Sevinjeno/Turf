import express from 'express';
import { createBookingController, getBookingsController } from '../controllers/bookingController.js';

const router = express.Router();

// Route for creating a booking
router.post('/', createBookingController);

router.get("/", getBookingsController);

export default router;