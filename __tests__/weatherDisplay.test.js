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
const weatherDisplay_1 = require("../src/weatherDisplay");
const weatherService_1 = require("../src/weatherService");
const gridpoints_json_1 = __importDefault(require("../src/gridpoints.json"));
const logger_1 = require("../src/logger");
jest.mock('../src/weatherService', () => ({
    getWeatherData: jest.fn(),
}));
jest.mock('../src/logger', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));
const gridpointsTyped = gridpoints_json_1.default;
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
describe('displayWeatherData', () => {
    const office = 'MPX';
    const { gridX, gridY } = gridpointsTyped[office];
    beforeEach(() => {
        jest.clearAllMocks();
        weatherService_1.getWeatherData.mockResolvedValue(mockWeatherData);
    });
    it('should log weather data for the specific office', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, weatherDisplay_1.displayWeatherData)(office);
        expect(logger_1.logger.info).toHaveBeenCalledWith(`Weather Data for Office: ${office}, GridX: ${gridX}, GridY: ${gridY}`);
        expect(logger_1.logger.info).toHaveBeenCalledWith({
            name: 'Tonight',
            startTime: '2024-07-29T21:00:00-05:00',
            endTime: '2024-07-30T06:00:00-05:00',
            temperature: 70,
            temperatureUnit: 'F',
            windSpeed: '0 mph',
            windDirection: '',
            shortForecast: 'Partly Cloudy',
            detailedForecast: 'Partly cloudy, with a low around 70. South wind around 0 mph.',
            probabilityOfPrecipitation: null,
        });
    }));
    it('should handle errors when logging weather data', () => __awaiter(void 0, void 0, void 0, function* () {
        const errorMessage = 'Failed to display weather data';
        weatherService_1.getWeatherData.mockRejectedValue(new Error(errorMessage));
        yield (0, weatherDisplay_1.displayWeatherData)(office);
        expect(logger_1.logger.error).toHaveBeenCalledWith('Failed to display weather data:', { error: errorMessage });
    }));
});
//# sourceMappingURL=weatherDisplay.test.js.map