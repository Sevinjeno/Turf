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