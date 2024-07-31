import { setCache, getCache } from '../src/redisClient';
import Redis from 'ioredis';

jest.mock('ioredis', () => {
    const mockRedis = {
        set: jest.fn(),
        get: jest.fn(),
    };
    return jest.fn(() => mockRedis);
});

const redisMock = new Redis() as jest.Mocked<Redis>;

describe('redisClient', () => {
    beforeEach(() => {
        redisMock.set.mockClear();
        redisMock.get.mockClear();
    });

    describe('setCache', () => {
        it('should set a key-value pair in Redis with expiration', async () => {
            const key = 'testKey';
            const value = 'testValue';
            const expireInSeconds = 3600;

            await setCache(key, value, expireInSeconds);

            expect(redisMock.set).toHaveBeenCalledWith(key, value, 'EX', expireInSeconds);
        });
    });

    describe('getCache', () => {
        it('should get a value from Redis by key', async () => {
            const key = 'testKey';
            const value = 'testValue';

            redisMock.get.mockResolvedValue(value);

            const result = await getCache(key);

            expect(redisMock.get).toHaveBeenCalledWith(key);
            expect(result).toBe(value);
        });

        it('shold return null if the key does not exist in Redis', async () => {
            const key = 'nonExistentKey';

            redisMock.get.mockResolvedValue(null);

            const result = await getCache(key);

            expect(redisMock.get).toHaveBeenCalledWith(key);
            expect(result).toBeNull();
        });
    });
});