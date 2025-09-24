import axios from "axios";

const API_BASE = "http://localhost:3000/api/auth"; // your backend base URL

export const sendOtp = async (method: "email" | "phone", data: string) => {
  let url = "";
  const payload = method === "email" ? { email: data } : { phone: data };

  if (method === "email") url = `${API_BASE}/email/send-otp`;
  else url = `${API_BASE}/phone/send-otp`;

  const res = await axios.post(url, payload);
  return res.data;
};

export const verifyOtp = async (method: "email" | "phone", data: string, otp: string) => {
  let url = "";
  const payload = method === "email" ? { email: data, otp } : { phone: data, otp };

  if (method === "email") url = `${API_BASE}/email/verify-otp`;
  else url = `${API_BASE}/phone/verify-otp`;

  const res = await axios.post(url, payload);
  return res.data;
};
