
import axios from "axios";
import { API } from "../api";

interface BookingPayload {
  turf_id: string | undefined ;
  user_id: string;
  start_time: string; // in ISO format (e.g., "2025-07-28T10:30:00")
  end_time: string;   // in ISO format
  slot_id?: number | null; // optional, if coming from admin-blocked/event slot
}

export const createBooking = async (data: BookingPayload) => {
  const response = await axios.post(`${API}/api/bookings`, data);
  return response.data;
};

export const getBookedSlots = async (turfId: string | undefined, date: string) => {
  const response = await axios.get(`${API}/api/bookings?turfId=${turfId}&date=${date}`);
  return response.data; // [{ start_time, end_time }]
};

