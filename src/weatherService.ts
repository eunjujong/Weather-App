import axios from 'axios';
import { setCache, getCache } from './redisClient';
import { WeatherData } from './types/WeatherData';
import gridpoints from './gridpoints.json';
import { GridPoints } from './types/GridPoints';

const gridpointsTyped: GridPoints = gridpoints;

export const fetchWeatherData = async (
  office: string,
): Promise<WeatherData> => {
  try {
    const { gridX, gridY } = gridpointsTyped[office];
    const forecastUrl = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`;
    const response = await axios.get(forecastUrl);
    return response.data as WeatherData;
  } catch (error: any) {
    console.error(
      'Error fetching weather data:',
      error.response ? error.response.data : error.message,
    );
    throw error;
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
      console.error('Error fetching and caching weather data', error);
      throw error;
    }
  }
};
