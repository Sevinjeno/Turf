import { confirmBookingAfterPaymentService } from '../services/bookingService.js';
import * as paymentService from '../services/paymentService.js';

// Process a new payment
export const processPayment = async (req, res) => {
    const { bookingId, amount, paymentType } = req.body;

    try {
        const payment = await paymentService.processPayment(bookingId, amount, paymentType);
        return res.status(201).json({ message: 'Payment processed successfully', data: payment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to process payment' });
    }
};

// Get payment details by booking ID
export const getPaymentByBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const payment = await paymentService.fetchPaymentForBooking(bookingId);
        return res.status(200).json({ data: payment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch payment' });
    }
};

export const createOrder = async (req, res) => {
    const { amount, receipt } = req.body;
  
    try {
      const order = await paymentService.createRazorpayOrder(amount, receipt);
      return res.status(201).json({ message: 'Order created successfully', data: order });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to create order' });
    }
  };





  //! New 

export const createPaymentIntentController = async (req, res) => {
  const { turf_id, court_id, start_time, end_time } = req.body;
  const user_id = req.user.id;

  const preview = await bookingService.previewBooking({
    user_id,
    turf_id,
    court_id,
    start_time,
    end_time,
  });

  const paymentIntent = await paymentService.createPaymentIntent({
    user_id,
    amount: preview.totalAmount,
    metadata: {
      user_id,
      turf_id,
      court_id,
      start_time,
      end_time,
    },
  });

  res.json(paymentIntent);
};


export const paymentWebhookController = async (req, res) => {
  const { status, payment_id, metadata } = req.body;

  if (status !== "SUCCESS") {
    return res.sendStatus(200);
  }

  await confirmBookingAfterPaymentService({
    user_id: metadata.user_id,
    turf_id: metadata.turf_id,
    court_id: metadata.court_id,
    start_time: metadata.start_time,
    end_time: metadata.end_time,
    payment_id,
  });

  res.send("OK");
};