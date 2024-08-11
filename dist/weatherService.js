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
exports.getWeatherData = exports.fetchWeatherData = void 0;
const axios_1 = __importDefault(require("axios"));
const redisClient_1 = require("./redisClient");
const gridpoints_json_1 = __importDefault(require("./gridpoints.json"));
const config_1 = require("./config");
const logger_1 = require("./logger");
const gridpointsTyped = gridpoints_json_1.default;
const fetchWeatherData = (office) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { gridX, gridY } = gridpointsTyped[office];
        const forecastUrl = `${config_1.config.weatherApiUrl}/gridpoints/${office}/${gridX},${gridY}/forecast`;
        const response = yield axios_1.default.get(forecastUrl);
        return response.data;
    }
    catch (error) {
        const errorMessage = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) || error.message || 'Unknown error';
        logger_1.logger.error('Error fetching weather data:', { error: errorMessage });
        throw new Error(errorMessage);
    }
});
exports.fetchWeatherData = fetchWeatherData;
const getWeatherData = (office) => __awaiter(void 0, void 0, void 0, function* () {
    const { gridX, gridY } = gridpointsTyped[office];
    const cacheKey = `weatherData:${office}:${gridX}:${gridY}`;
    const cachedData = yield (0, redisClient_1.getCache)(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    else {
        try {
            const fetchedData = yield (0, exports.fetchWeatherData)(office);
            yield (0, redisClient_1.setCache)(cacheKey, JSON.stringify(fetchedData), 3600);
            return fetchedData;
        }
        catch (error) {
            logger_1.logger.error('Error fetching and caching weather data', error);
            throw error;
        }
    }
});
exports.getWeatherData = getWeatherData;
//# sourceMappingURL=weatherService.js.map