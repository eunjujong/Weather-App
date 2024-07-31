import { getWeatherData } from './weatherService';
import gridpoints from './gridpoints.json';
import { GridPoints } from './types/GridPoints';

const gridpointsTyped: GridPoints = gridpoints;

export const displayWeatherData = async (office: string) => {
  try {
    const weather = await getWeatherData(office);
    const { gridX, gridY } = gridpointsTyped[office];
    console.log(
      `Weather Data for Office: ${office}, GridX: ${gridX}, GridY: ${gridY}`,
    );
    weather.properties.periods.forEach((period) => {
      console.log({
        name: period.name,
        startTime: period.startTime,
        endTime: period.endTime,
        temperature: period.temperature,
        temperatureUnit: period.temperatureUnit,
        windSpeed: period.windSpeed,
        windDirection: period.windDirection,
        shortForecast: period.shortForecast,
        detailedForecast: period.detailedForecast,
        probabilityOfPrecipitation: period.probabilityOfPrecipitation.value,
      });
    });
  } catch (error) {
    console.error('Failed to display weather data:', error);
  }
};
