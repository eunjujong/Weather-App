import Redis from 'ioredis';
import { config } from './config';

const redis = new Redis({
    host: config.redisHost,
    port: config.redisPort,
  });

export const setCache = async (
  key: string,
  value: string,
  expireInSeconds: number,
) => {
  await redis.set(key, value, 'EX', expireInSeconds);
};

export const getCache = async (key: string): Promise<string | null> => {
  return await redis.get(key);
};
