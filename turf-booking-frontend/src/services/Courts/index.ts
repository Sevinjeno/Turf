import axios from "axios";
import  API  from "../api";

export const getCourtsbyTurfId = async (turfId: string) => {
  try {
    const response = await axios.get(`${API}/api/courts/${turfId}`);
    return response.data; // Adjust based on your backend's response shape
  } catch (error) {
    console.error("Failed to fetch courts", error);
    throw new Error("Failed to fetch courts");
  }
}