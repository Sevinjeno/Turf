// utils/otpService.js
import redis from './RedisClient.js';

const OTP_EXPIRE_TIME = 300; // 5 minutes in seconds

export const storeOtp = async (key, otp) => {
  await redis.set(key, otp, 'EX', OTP_EXPIRE_TIME);
};

export const getOtp = async (key) => {
  return await redis.get(key);
};

export const deleteOtp = async (key) => {
  await redis.del(key);
};
