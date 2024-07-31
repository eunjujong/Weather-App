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
exports.displayWeatherData = void 0;
const weatherService_1 = require("./weatherService");
const gridpoints_json_1 = __importDefault(require("./gridpoints.json"));
const gridpointsTyped = gridpoints_json_1.default;
const displayWeatherData = (office) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const weather = yield (0, weatherService_1.getWeatherData)(office);
        const { gridX, gridY } = gridpointsTyped[office];
        console.log(`Weather Data for Office: ${office}, GridX: ${gridX}, GridY: ${gridY}`);
        weather.properties.periods.forEach(period => {
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
                probabilityOfPrecipitation: period.probabilityOfPrecipitation.value
            });
        });
    }
    catch (error) {
        console.error('Failed to display weather data:', error);
    }
});
exports.displayWeatherData = displayWeatherData;
//# sourceMappingURL=weatherDisplay.js.map