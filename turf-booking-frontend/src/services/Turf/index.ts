import axios from "axios";
import  API  from "../api";

interface loc{
    lat: number;
    lon: number;    
}
interface Turf {
    adminId: number;
    name: string;
    at: number;
    lon: number;
    price: number;
    imageUrl?: string;
    startTime: string;
    endTime: string;
}

export const createTurf = async (form:FormData) => {
        const response = await axios.post(`${API}/api/turfs/`, form);
        return response.data;
};

export const fetchTurfsByAdminId = async (adminId: number) => {
  try {
    const response = await axios.get(`${API}/api/turfs/admin/${adminId}`);
    return response.data.data; // Adjust based on your backend's response shape
  } catch (error) {
    console.error("Failed to fetch turfs", error);
    throw new Error("Failed to fetch turfs");
  }
};

export const updateTurf = async (turfId: number, data: any) => {
  try {
    const response = await axios.put(`${API}/api/turfs/update/${turfId}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // Adjust if your backend wraps it in `{ data: ... }`
  } catch (error) {
    console.error("Failed to update turf:", error);
    throw new Error("Failed to update turf");
  }
};