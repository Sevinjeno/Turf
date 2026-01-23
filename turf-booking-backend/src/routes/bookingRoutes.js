import express from 'express';
// import {  getBookingsController } from '../controllers/bookingController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { previewBookingController } from '../controllers/bookingController.js';

const router = express.Router();

// Route for creating a booking
router.post('/preview', previewBookingController);
// router.post("/", authenticate, createBookingController);

// router.get("/", getBookingsController);

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


/**
 * @swagger
 * /bookings/preview:
 *   post:
 *     summary: Preview booking price before payment
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
 *                 example: "uuid-turf-id"
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-01-15T10:00:00Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-01-15T12:00:00Z"
 *     responses:
 *       200:
 *         description: Pricing breakdown
*/

// *         content:
// *           application/json:
//  *             schema:
//  *               $ref: "#/components/schemas/BookingPrice"

/**
 * @swagger
 * /bookings/confirm:
 *   post:
 *     summary: Confirm booking after payment success
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - turf_id
 *               - court_id
 *               - start_time
 *               - end_time
 *               - payment_id
 *             properties:
 *               turf_id:
 *                 type: string
 *               court_id:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               payment_id:
 *                 type: string
 *                 example: "pay_razorpay_123"
 *     responses:
 *       200:
 *         description: Booking confirmed successfully
 */
