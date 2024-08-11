import axios from 'axios';
import { setCache, getCache } from './redisClient';
import { WeatherData } from './types/WeatherData';
import gridpoints from './gridpoints.json';
import { GridPoints } from './types/GridPoints';
import { config } from './config';
import { logger } from './logger';

const gridpointsTyped: GridPoints = gridpoints;

export const fetchWeatherData = async (
  office: string,
): Promise<WeatherData> => {
  try {
    const { gridX, gridY } = gridpointsTyped[office];
    const forecastUrl = `${config.weatherApiUrl}/gridpoints/${office}/${gridX},${gridY}/forecast`;
    const response = await axios.get(forecastUrl);
    return response.data as WeatherData;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail || error.message || 'Unknown error';
    logger.error('Error fetching weather data:', { error: errorMessage });
    throw new Error(errorMessage);
  }
};

export const getWeatherData = async (office: string): Promise<WeatherData> => {
  const { gridX, gridY } = gridpointsTyped[office];
  const cacheKey = `weatherData:${office}:${gridX}:${gridY}`;
  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData) as WeatherData;
  } else {
    try {
      const fetchedData = await fetchWeatherData(office);
      await setCache(cacheKey, JSON.stringify(fetchedData), 3600);
      return fetchedData;
    } catch (error) {
      logger.error('Error fetching and caching weather data', error);
      throw error;
    }
  }
};
