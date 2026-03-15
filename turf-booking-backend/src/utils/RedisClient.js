// utils/redisClient.js
import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});


export const storeOtp = async (key, otp, expireTime = 300) => {
  try {
    await redis.set(`otp:${key}`, otp, "EX", expireTime);
    return true; // success
  } catch (err) {
    console.error("Redis store error:", err);
    return false; // fallback
  }
};

export const getOtp = async (key) => {
  try {
    return await redis.get(`otp:${key}`);
  } catch (err) {
    console.error("Redis get error:", err);
    return null; // fallback
  }
};

export const deleteOtp = async (key) => {
  try {
    await redis.del(`otp:${key}`);
    return true;
  } catch (err) {
    console.error("Redis delete error:", err);
    return false;
  }
};


export default redis;