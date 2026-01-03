import express from 'express';
import { createBookingController, getBookingsController } from '../controllers/bookingController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route for creating a booking
// router.post('/', createBookingController);
router.post("/", authenticate, createBookingController);

router.get("/", getBookingsController);

export default router;