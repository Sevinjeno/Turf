

import api from "../api";

interface BookingPayload {
  turf_id: string | undefined ;
  start_time: string; // in ISO format (e.g., "2025-07-28T10:30:00")
  end_time: string;   // in ISO format
  slot_id?: number | null; // optional, if coming from admin-blocked/event slot
  court_id?:string | number | null
}

// CREATE BOOKING (protected)
export const createBooking = async (data: BookingPayload) => {
  const response = await api.post("bookings/book", data);
  return response.data;
};

// GET BOOKED SLOTS (public OR protected — interceptor safe)
export const getBookedSlots = async (turfId: string | undefined, date: string) => {
  const response = await api.get(`bookings?turfId=${turfId}&date=${date}`);
  return response.data;
};

// PREVIEW BOOKING (protected)
export const previewBooking = async (data: BookingPayload) => {
  const response = await api.post("bookings/preview", data);
  return response.data;
};