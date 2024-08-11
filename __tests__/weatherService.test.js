"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const axios_1 = __importDefault(require("axios"));
const axios_mock_adapter_1 = __importDefault(require("axios-mock-adapter"));
const weatherService_1 = require("../src/weatherService");
const gridpoints_json_1 = __importDefault(require("../src/gridpoints.json"));
const config_1 = require("../src/config");
jest.mock('../src/redisClient', () => ({
    setCache: jest.fn(),
    getCache: jest.fn(),
}));
jest.mock('../src/logger', () => ({
    logger: {
        error: jest.fn(),
    },
}));
const mockAxios = new axios_mock_adapter_1.default(axios_1.default);
const redisMock = require('../src/redisClient');
const loggerMock = require('../src/logger').logger;
const gridpointsTyped = gridpoints_json_1.default;
describe('weatherService', () => {
    const office = 'MPX';
    const { gridX, gridY } = gridpointsTyped[office];
    const cacheKey = `weatherData:${office}:${gridX}:${gridY}`;
    const mockWeatherData = {
        '@context': [
            'https://geojson.org/geojson-ld/geojson-context.jsonld',
            {
                '@version': '1.1',
                wx: '${config.weatherApiUrl}/ontology#',
                geo: 'http://www.opengis.net/ont/geosparql#',
                unit: 'http://codes.wmo.int/common/unit/',
                '@vocab': '${config.weatherApiUrl}/ontology#',
            },
        ],
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [
                [
                    [-93.3227901, 44.9871956],
                    [-93.3231641, 44.9658118],
                    [-93.2929421, 44.9655449],
                    [-93.29256140000001, 44.9869287],
                    [-93.3227901, 44.9871956],
                ],
            ],
        },
        properties: {
            units: 'us',
            forecastGenerator: 'BaselineForecastGenerator',
            generatedAt: '2024-07-30T02:15:22+00:00',
            updateTime: '2024-07-30T00:48:27+00:00',
            validTimes: '2024-07-29T18:00:00+00:00/P7DT7H',
            elevation: {
                unitCode: 'wmoUnit:m',
                value: 259.08,
            },
            periods: [
                {
                    number: 1,
                    name: 'Tonight',
                    startTime: '2024-07-29T21:00:00-05:00',
                    endTime: '2024-07-30T06:00:00-05:00',
                    isDaytime: false,
                    temperature: 70,
                    temperatureUnit: 'F',
                    temperatureTrend: '',
                    probabilityOfPrecipitation: {
                        unitCode: 'wmoUnit:percent',
                        value: null,
                    },
                    windSpeed: '0 mph',
                    windDirection: '',
                    icon: '${config.weatherApiUrl}/icons/land/night/sct?size=medium',
                    shortForecast: 'Partly Cloudy',
                    detailedForecast: 'Partly cloudy, with a low around 70. South wind around 0 mph.',
                },
            ],
        },
    };
    beforeEach(() => {
        jest.clearAllMocks();
        mockAxios.reset();
    });
    describe('fetchWeatherData', () => {
        it('should fetch weather data from the API', () => __awaiter(void 0, void 0, void 0, function* () {
            mockAxios
                .onGet(`${config_1.config.weatherApiUrl}/gridpoints/${office}/${gridX},${gridY}/forecast`)
                .reply(200, mockWeatherData);
            const fetchedData = yield (0, weatherService_1.fetchWeatherData)(office);
            expect(fetchedData).toEqual(mockWeatherData);
        }));
        it('should log an error and throw if the API request fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'Request failed with status code 500';
            mockAxios
                .onGet(`${config_1.config.weatherApiUrl}/gridpoints/${office}/${gridX},${gridY}/forecast`)
                .reply(500);
            yield expect((0, weatherService_1.fetchWeatherData)(office)).rejects.toThrow(errorMessage);
            expect(loggerMock.error).toHaveBeenCalledWith('Error fetching weather data:', { error: expect.stringContaining(errorMessage) });
        }));
    });
    describe('getWeatherData', () => {
        it('should return cached data if available', () => __awaiter(void 0, void 0, void 0, function* () {
            redisMock.getCache.mockResolvedValueOnce(JSON.stringify(mockWeatherData));
            const savedData = yield (0, weatherService_1.getWeatherData)(office);
            expect(redisMock.getCache).toHaveBeenCalledWith(cacheKey);
            expect(savedData).toEqual(mockWeatherData);
        }));
        it('should fetch, cache, and return data if not cached', () => __awaiter(void 0, void 0, void 0, function* () {
            redisMock.getCache.mockResolvedValueOnce(null);
            mockAxios
                .onGet(`${config_1.config.weatherApiUrl}/gridpoints/${office}/${gridX},${gridY}/forecast`)
                .reply(200, mockWeatherData);
            const savedData = yield (0, weatherService_1.getWeatherData)(office);
            expect(redisMock.getCache).toHaveBeenCalledWith(cacheKey);
            expect(redisMock.setCache).toHaveBeenCalledWith(cacheKey, JSON.stringify(mockWeatherData), 3600);
            expect(savedData).toEqual(mockWeatherData);
        }));
        it('should log an error and throw if fetching data fails', () => __awaiter(void 0, void 0, void 0, function* () {
            redisMock.getCache.mockResolvedValueOnce(null);
            const errorMessage = 'Request failed with status code 500';
            mockAxios
                .onGet(`${config_1.config.weatherApiUrl}/gridpoints/${office}/${gridX},${gridY}/forecast`)
                .reply(500);
            yield expect((0, weatherService_1.getWeatherData)(office)).rejects.toThrow(errorMessage);
            expect(loggerMock.error).toHaveBeenCalledWith('Error fetching and caching weather data', expect.any(Error));
        }));
    });
});
//# sourceMappingURL=weatherService.test.js.map