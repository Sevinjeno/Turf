import axios from "axios";
import api from "../api";
const BASE_URL = "http://localhost:3000/api/auth";

// ✅ OTP sending → no auth token yet, so use plain axios
export const sendOtp = async (method: "email" | "phone", data: string) => {
  const payload = method === "email" ? { email: data } : { phone: data };
  const url = method === "email" ? `${BASE_URL}/email/send-otp` : `${BASE_URL}/phone/send-otp`;
  const res = await axios.post(url, payload, { withCredentials: true });
  return res.data;
};

export const verifyOtp = async (method: "email" | "phone", data: string, otp: string) => {
  const payload = method === "email" ? { email: data, otp } : { phone: data, otp };
  const url = method === "email" ? `${BASE_URL}/email/verify-otp` : `${BASE_URL}/phone/verify-otp`;
  const res = await axios.post(url, payload, { withCredentials: true });
  return res.data;
};

// ✅ These need interceptor (api) because they require Authorization
export const refresh = () => api.get("/auth/refresh");
export const logoutService = () => api.post("/auth/logout");
export const fetchProfile = () => api.get("/profile");