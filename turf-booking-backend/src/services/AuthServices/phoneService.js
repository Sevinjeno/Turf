import { storeOtp, getOtp, deleteOtp } from "../../utils/RedisClient.js";
import { fetchUserByPhone, registerUser } from "../userService.js";
import { generateAccessToken } from "../../utils/jwtUtils.js";
import { generateOtp } from "../../utils/OtpUtils.js";

const OTP_EXPIRE_TIME = 300; // 5 minutes

export const sendPhoneOtp = async (phone) => {
  const otp = generateOtp();
  await storeOtp(phone, otp, OTP_EXPIRE_TIME);
  // TODO: Integrate with SMS service to send OTP
  console.log(`Sending OTP ${otp} to phone ${phone}`);

  return { message: "OTP sent successfully", phone };
};

export const verifyPhoneOtp = async (phone, otp) => {
  const storedOtp = await getOtp(phone);
  if (!storedOtp || storedOtp !== otp) {
    throw new Error("Invalid or expired OTP");
  }
  await deleteOtp(phone);

  let user = await fetchUserByPhone(phone);
  if (!user) {
    user = await registerUser({ phone });
  }
  const token = generateAccessToken(user);
  return { token, user };
};
