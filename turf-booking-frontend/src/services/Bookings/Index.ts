
import axios from "axios";
import { API_URL } from "../api";

interface BookingPayload {
  turf_id: string | undefined ;
  start_time: string; // in ISO format (e.g., "2025-07-28T10:30:00")
  end_time: string;   // in ISO format
  slot_id?: number | null; // optional, if coming from admin-blocked/event slot
  court_id?:string | number | null
}

export const createBooking = async (data: BookingPayload) => {
  try{
    const response = await axios.post(`${API_URL}bookings`, data,{withCredentials:true});
    return response.data;
  }catch(err){
  }
};

export const getBookedSlots = async (turfId: string | undefined, date: string) => {
  const response = await axios.get(`${API_URL}bookings?turfId=${turfId}&date=${date}`);
  return response.data; // [{ start_time, end_time }]
};

export const previewBooking = async(data:BookingPayload)=>{
  try{
    const response = await axios.post(`${API_URL}bookings/preview`, data,{withCredentials:true});
     return response.data;
  } catch(err){

  }

}