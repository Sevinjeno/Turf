import express from 'express';
import { createBookingController, getBookingsController } from '../controllers/bookingController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route for creating a booking
// router.post('/', createBookingController);
router.post("/", authenticate, createBookingController);

router.get("/", getBookingsController);

export default router;

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - turf_id
 *               - start_time
 *               - end_time
 *             properties:
 *               turf_id:
 *                 type: string
 *               court_id:
 *                 type: string
 *                 nullable: true
 *               slot_id:
 *                 type: number
 *                 nullable: true
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created
 *       409:
 *         description: Slot conflict
 */
