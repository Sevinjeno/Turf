
import axios from "axios";
import { API } from "../api";

export const fetchTurfSlots = async (turfId: any, date: string) => {
  const response = await axios.get(`${API}/api/slots/${turfId}/${date}`);
  return response.data;
};