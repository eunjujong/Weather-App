import Redis from 'ioredis';

const redis = new Redis();

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
