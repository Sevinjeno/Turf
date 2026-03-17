import axios from "axios";

const api = axios.create({
  baseURL: "http://YOUR_IP:3000/api",
});

export const sendOtp = (method: string, value: string) => {
  return api.post("/auth/send-otp", { method, value });
};

export const verifyOtp = (method: string, value: string, otp: string) => {
  return api.post("/auth/verify-otp", { method, value, otp });
};