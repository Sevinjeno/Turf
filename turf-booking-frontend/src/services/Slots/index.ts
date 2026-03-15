
import axios from "axios";
import { API_URL } from "../api";

export const fetchTurfSlots = async (turfId: any, date: string) => {
  const response = await axios.get(`${API_URL}slots/${turfId}/${date}`);
  return response.data;
};


interface Slot {
  id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export const getSlots = async (turf_id: number, date: string) => {
  try {
    const response = await axios.get<Slot[]>(`${API_URL}/${turf_id}/${date}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching slots:", error);
    return [];
  }
};

export const bookSlot = async (slotId: number) => {
  try {
    const response = await axios.put<Slot>(`${API_URL}/book/${slotId}`);
    return response.data;
  } catch (error) {
    console.error("Error booking slot:", error);
    return null;
  }
};

export const createSlot = async (slotData: Omit<Slot, "id">) => {
  try {
    const response = await axios.post<Slot>(`${API_URL}/create`, slotData);
    return response.data;
  } catch (error) {
    console.error("Error creating slot:", error);
    return null;
  }
};