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
const redisClient_1 = require("../src/redisClient");
const ioredis_1 = __importDefault(require("ioredis"));
jest.mock('ioredis', () => {
    const mockRedis = {
        set: jest.fn(),
        get: jest.fn(),
    };
    return jest.fn(() => mockRedis);
});
const redisMock = new ioredis_1.default();
describe('redisClient', () => {
    beforeEach(() => {
        redisMock.set.mockClear();
        redisMock.get.mockClear();
    });
    describe('setCache', () => {
        it('should set a key-value pair in Redis with expiration', () => __awaiter(void 0, void 0, void 0, function* () {
            const key = 'testKey';
            const value = 'testValue';
            const expireInSeconds = 3600;
            yield (0, redisClient_1.setCache)(key, value, expireInSeconds);
            expect(redisMock.set).toHaveBeenCalledWith(key, value, 'EX', expireInSeconds);
        }));
    });
    describe('getCache', () => {
        it('should get a value from Redis by key', () => __awaiter(void 0, void 0, void 0, function* () {
            const key = 'testKey';
            const value = 'testValue';
            redisMock.get.mockResolvedValue(value);
            const result = yield (0, redisClient_1.getCache)(key);
            expect(redisMock.get).toHaveBeenCalledWith(key);
            expect(result).toBe(value);
        }));
        it('shold return null if the key does not exist in Redis', () => __awaiter(void 0, void 0, void 0, function* () {
            const key = 'nonExistentKey';
            redisMock.get.mockResolvedValue(null);
            const result = yield (0, redisClient_1.getCache)(key);
            expect(redisMock.get).toHaveBeenCalledWith(key);
            expect(result).toBeNull();
        }));
    });
});
//# sourceMappingURL=redisClient.test.js.map