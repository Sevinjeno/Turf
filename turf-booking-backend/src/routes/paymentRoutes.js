import express from 'express';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

// Route for processing payment
router.post('/process', paymentController.processPayment);

// Route for fetching payment by booking ID
router.get('/booking/:bookingId', paymentController.getPaymentByBooking);

export default router;