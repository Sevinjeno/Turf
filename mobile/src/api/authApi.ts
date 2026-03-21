import api from "./api";
import { setToken } from "../utils/secureStore";


const isEmail=(value:string)=>value.includes("@")

export const sendOtpApi = async (value: string) => {

  if(isEmail(value)){
     return await api.post("/auth/email/send-otp",{email:value});
  }else{
     return await api.post("/auth/phone/send-otp",{phone:value});
  }
};

export const verifyOtpApi = async (value: string, otp: string) => {
  let res;

  if(isEmail(value)){
    res=await api.post("/auth/email/verify-otp",{email:value,otp,})
  }else{
    res=await api.post("/auth/phone/verify-otp",{
      phone:value,
      otp,
    })
  }
  const { accessToken, refreshToken, user } = res.data;

  // 🔥 store tokens securely
  await setToken("accessToken", accessToken);
  await setToken("refreshToken", refreshToken);

  return user;
};