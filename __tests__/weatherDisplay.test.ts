import { displayWeatherData } from '../src/weatherDisplay';
import { getWeatherData } from '../src/weatherService';
import { WeatherData } from '../src/types/WeatherData';
import gridpoints from '../src/gridpoints.json';
import { GridPoints } from '../src/types/GridPoints';

jest.mock('../src/weatherService', () => ({
    getWeatherData: jest.fn(),
}));

const gridpointsTyped: GridPoints = gridpoints;

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

describe('displayWeatherData', () => {
    const office = 'MPX';
    const { gridX, gridY } = gridpointsTyped[office];

    beforeEach(() => {
        jest.clearAllMocks();
        (getWeatherData as jest.Mock).mockResolvedValue(mockWeatherData);
    });

    it('should display weather data for the specific office', async () => {
        console.log = jest.fn();

        await displayWeatherData(office);

        expect(console.log).toHaveBeenCalledWith(`Weather Data for Office: ${office}, GridX: ${gridX}, GridY: ${gridY}`);
        expect(console.log).toHaveBeenCalledWith({
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
    });

    it('should handle errors when displaying weather data', async () => {
        const errorMessage = 'Failed to display weather data';
        (getWeatherData as jest.Mock).mockRejectedValue(new Error(errorMessage));
        console.error = jest.fn();

        await displayWeatherData(office);

        expect(console.error).toHaveBeenCalledWith('Failed to display weather data:', new Error(errorMessage));
    });
});
