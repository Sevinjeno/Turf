import api from "../api/api";
import {
  BookingPreviewRequest,
  BookingPreviewResponse,
  CreateBookingRequest,
} from "../types/bookings";

export const previewBooking = async (
  data: BookingPreviewRequest
): Promise<BookingPreviewResponse> => {
  const res = await api.post("/bookings/preview", data);
  return res.data;
};

export const createBooking = async (
  data: CreateBookingRequest
) => {
  const res = await api.post("/bookings", data);
  return res.data;
};