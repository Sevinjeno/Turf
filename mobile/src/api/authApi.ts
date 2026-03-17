import api from "./api";
import { setToken } from "../utils/secureStore";

export const sendOtpApi = (value: string) => {
  return api.post("/auth/send-otp", { value });
};

export const verifyOtpApi = async (value: string, otp: string) => {
  const res = await api.post("/auth/verify-otp", { value, otp });

  const { accessToken, refreshToken, user } = res.data;

  // 🔥 store tokens securely
  await setToken("accessToken", accessToken);
  await setToken("refreshToken", refreshToken);

  return user;
};