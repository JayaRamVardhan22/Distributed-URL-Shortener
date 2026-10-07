const { redisClient } = require("../config/redis");

const CACHE_TTL = 3600;

const getCachedUrl = async (shortCode) => {
    const cachedUrl = await redisClient.get(`url:${shortCode}`);

    if (!cachedUrl) {
        return null;
    }

    return JSON.parse(cachedUrl);
};

const cacheUrl = async (shortCode, urlData) => {
    await redisClient.set(
        `url:${shortCode}`,
        JSON.stringify(urlData),
        {
            EX: CACHE_TTL
        }
    );
};

const deleteCachedUrl = async (shortCode) => {
    await redisClient.del(`url:${shortCode}`);
};

module.exports = {
    getCachedUrl,
    cacheUrl,
    deleteCachedUrl
};