import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchWeatherData, getWeatherData } from '../src/weatherService';
import { setCache, getCache } from '../src/redisClient';
import { WeatherData } from '../src/types/WeatherData';
import gridpoints from '../src/gridpoints.json';
import { GridPoints } from '../src/types/GridPoints';

const mockAxios = new MockAdapter(axios);

jest.mock('../src/redisClient', () => ({
    setCache: jest.fn(),
    getCache: jest.fn()
}));

const redisMock = require('../src/redisClient');

const gridpointsTyped: GridPoints = gridpoints;

describe('weatherService', () => {
    const office = 'MPX';
    const { gridX, gridY } = gridpointsTyped[office];
    const cacheKey = `weatherData:${office}:${gridX}:${gridY}`;
    const mockWeatherData: WeatherData = {
        "@context": [
            "https://geojson.org/geojson-ld/geojson-context.jsonld",
            {
                "@version": "1.1",
                "wx": "https://api.weather.gov/ontology#",
                "geo": "http://www.opengis.net/ont/geosparql#",
                "unit": "http://codes.wmo.int/common/unit/",
                "@vocab": "https://api.weather.gov/ontology#"
            }
        ],
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [
                [
                    [-93.3227901, 44.9871956],
                    [-93.3231641, 44.9658118],
                    [-93.2929421, 44.9655449],
                    [-93.29256140000001, 44.9869287],
                    [-93.3227901, 44.9871956]
                ]
            ]
        },
        properties: {
            units: "us",
            forecastGenerator: "BaselineForecastGenerator",
            generatedAt: "2024-07-30T02:15:22+00:00",
            updateTime: "2024-07-30T00:48:27+00:00",
            validTimes: "2024-07-29T18:00:00+00:00/P7DT7H",
            elevation: {
                unitCode: "wmoUnit:m",
                value: 259.08
            },
            periods: [
                {
                    number: 1,
                    name: "Tonight",
                    startTime: "2024-07-29T21:00:00-05:00",
                    endTime: "2024-07-30T06:00:00-05:00",
                    isDaytime: false,
                    temperature: 70,
                    temperatureUnit: "F",
                    temperatureTrend: "",
                    probabilityOfPrecipitation: {
                        unitCode: "wmoUnit:percent",
                        value: null
                    },
                    windSpeed: "0 mph",
                    windDirection: "",
                    icon: "https://api.weather.gov/icons/land/night/sct?size=medium",
                    shortForecast: "Partly Cloudy",
                    detailedForecast: "Partly cloudy, with a low around 70. South wind around 0 mph."
                }
            ]
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockAxios.reset();
    });

    describe('fetchWeatherData', () => {
        it('should fetch weather data from the API', async () => {
            mockAxios.onGet(`https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`).reply(200, mockWeatherData);

            const fetchedData = await fetchWeatherData(office);

            expect(fetchedData).toEqual(mockWeatherData);
        });

        it('should throw an error if the API request fails', async () => {
            mockAxios.onGet(`https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`).reply(500);

            await expect(fetchWeatherData(office)).rejects.toThrow('Request failed with status code 500');
        });
    });

    describe('getWeatherData', () => {
        it('should return cached data if available', async () => {
            redisMock.getCache.mockResolvedValueOnce(JSON.stringify(mockWeatherData));

            const savedData = await getWeatherData(office);

            expect(redisMock.getCache).toHaveBeenCalledWith(cacheKey);
            expect(savedData).toEqual(mockWeatherData);
        });

        it('should fetch, cache, and return data if not cached', async () => {
            redisMock.getCache.mockResolvedValueOnce(null);
            mockAxios.onGet(`https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`).reply(200, mockWeatherData);

            const savedData = await getWeatherData(office);

            expect(redisMock.getCache).toHaveBeenCalledWith(cacheKey);
            expect(redisMock.setCache).toHaveBeenCalledWith(cacheKey, JSON.stringify(mockWeatherData), 3600);
            expect(savedData).toEqual(mockWeatherData);
        });

        it('should throw an error if fetching data fails', async () => {
            redisMock.getCache.mockResolvedValueOnce(null);
            mockAxios.onGet(`https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`).reply(500);

            await expect(getWeatherData(office)).rejects.toThrow('Request failed with status code 500');
        });
    });
});
