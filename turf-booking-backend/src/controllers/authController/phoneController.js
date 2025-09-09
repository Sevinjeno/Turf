import { sendPhoneOtp, verifyPhoneOtp } from "../../services/AuthServices/phoneService.js";


export const sendPhoneOTPController =async(req,res)=>{
    const {phone}=req.body;
    const result=await sendPhoneOtp(phone);
    return res.json(result)
}


export const verifyPhoneOTPController=async(req,res)=>{
  const {phone,otp}=req.body;
  const result=await verifyPhoneOtp(phone,otp);
  return res.json(result)
}