import { createPayment, getPaymentByBookingId } from '../models/paymentModel.js';

export const processPayment = async (bookingId, amount, paymentType) => {
    return await createPayment(bookingId, amount, paymentType);
};

export const fetchPaymentForBooking = async (bookingId) => {
    return await getPaymentByBookingId(bookingId);
};