import dotenv from 'dotenv';

dotenv.config();

export const config = {
  weatherApiUrl: process.env.WEATHER_API_URL || 'https://api.weather.gov',
  redisHost: process.env.REDIS_HOST || 'redis',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  cacheTTL: parseInt(process.env.CACHE_TTL || '3600', 10),
};
