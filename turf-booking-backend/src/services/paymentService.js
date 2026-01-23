import { createPayment, getPaymentByBookingId } from '../models/paymentModel.js';

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
//   });

// export const processPayment = async (bookingId, amount, paymentType) => {
//     return await createPayment(bookingId, amount, paymentType);
// };

// export const fetchPaymentForBooking = async (bookingId) => {
//     return await getPaymentByBookingId(bookingId);
// };

// export const createRazorpayOrder = async (amount, receiptId) => {
//     const options = {
//       amount: amount * 100, // Razorpay expects amount in paise
//       currency: 'INR',
//       receipt: receiptId,
//       payment_capture: 1,
//     };
  
//     const order = await razorpay.orders.create(options);
//     return order;
//   };

export const createPaymentIntent = async ({
  user_id,
  amount,
  metadata,
}) => {
  // Fake payment intent (Stripe-style)
  return {
    payment_intent_id: uuid(),
    amount,
    currency: "INR",
    status: "CREATED",
    metadata, // booking details stored safely
  };
};