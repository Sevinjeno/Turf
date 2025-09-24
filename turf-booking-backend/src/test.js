import { getOtp, storeOtp } from "./utils/RedisClient.js";

const test = async () => {
  await storeOtp('test@example.com', '123456', 300);
  const otp = await getOtp('test@example.com');
  console.log("Stored OTP:", otp); // Should print 123456
};
test();
