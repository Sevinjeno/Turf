import { createBooking, getBookingsByUser } from '../models/bookingModel.js';

export const createNewBooking = async (userId, turfId, startTime, endTime) => {
    return await createBooking(userId, turfId, startTime, endTime);
};

export const fetchBookingsForUser = async (userId) => {
    return await getBookingsByUser(userId);
};