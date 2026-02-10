import axios from "axios";
import  API  from "../api";


// HALF_A → U1
// HALF_B → U2
// HALF_C → U3
// FULL   → U1 + U2 + U3


export const getCourtsbyTurfId = async (turfId: string) => {
  try {
    const response = await API.get(`/courts/${turfId}`);
    return response.data; // Adjust based on your backend's response shape
  } catch (error) {
    console.error("Failed to fetch courts", error);
    throw new Error("Failed to fetch courts");
  }
}