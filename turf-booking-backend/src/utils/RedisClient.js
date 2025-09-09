// utils/redisClient.js
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});


export const storeOtp = async (key, otp, expireTime = 300) => {
    await redis.set(`otp:${key}`, otp, { EX: expireTime });
};

export const getOtp = async (key) => {
    return await redis.get(`otp:${key}`);
};

export const deleteOtp = async (key) => {
    await redis.del(`otp:${key}`);
};


export default redis;