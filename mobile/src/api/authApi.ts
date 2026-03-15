import {api} from "../services/axiosClient";

export const sendOtpApi = async (mobile: string) => {
  const res = await api.post("/auth/send-otp", {
    mobile
  });

  return res.data;
};

export const verifyOtpApi = async (mobile: string, otp: string) => {

  const res = await api.post("/auth/verify-otp", {
    mobile,
    otp
  });

  return res.data;
};