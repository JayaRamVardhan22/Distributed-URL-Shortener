const Url = require("../models/urlModel");
const { generateShortCode } = require("../utils/shortCode");
const {
    getCachedUrl,
    cacheUrl,
    deleteCachedUrl
} = require("./cacheService");
const createShortUrl = async (originalUrl, expiresAt = null) => {
    const MAX_ATTEMPTS = 5;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const shortCode = generateShortCode();

        try {
            const url = await Url.create({
                originalUrl,
                shortCode,
                expiresAt
            });

            return url;
        } catch (error) {
            if (error.code === 11000 && attempt < MAX_ATTEMPTS) {
                continue;
            }

            throw error;
        }
    }

    throw new Error("Failed to generate a unique short code");
};

const getUrlByShortCode = async (shortCode) => {
    // 1. Check Redis cache
    const cachedUrl = await getCachedUrl(shortCode);

    if (cachedUrl) {
        // Check expiration even for cached URLs
        if (
            cachedUrl.expiresAt &&
            new Date(cachedUrl.expiresAt) <= new Date()
        ) {
            return null;
        }

        return cachedUrl;
    }

    // 2. Cache miss → query MongoDB
    const url = await Url.findOne({ shortCode });

    if (!url) {
        return null;
    }

    // 3. Check expiration
    if (url.expiresAt && url.expiresAt <= new Date()) {
        return null;
    }

    // 4. Store URL in Redis
    await cacheUrl(shortCode, {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        expiresAt: url.expiresAt,
        clickCount: url.clickCount,
        lastAccessedAt: url.lastAccessedAt,
        createdAt: url.createdAt
    });

    return url;
};

const incrementClickCount = async (shortCode) => {
    const updatedUrl = await Url.findOneAndUpdate(
        { shortCode },
        {
            $inc: { clickCount: 1 },
            $set: { lastAccessedAt: new Date() }
        },
        { new: true }
    );

    if (updatedUrl) {
        await cacheUrl(shortCode, {
            originalUrl: updatedUrl.originalUrl,
            shortCode: updatedUrl.shortCode,
            expiresAt: updatedUrl.expiresAt,
            clickCount: updatedUrl.clickCount,
            lastAccessedAt: updatedUrl.lastAccessedAt,
            createdAt: updatedUrl.createdAt
        });
    }

    return updatedUrl;
};

const deleteShortUrl = async (shortCode) => {
    const deletedUrl = await Url.findOneAndDelete({ shortCode });

    if (!deletedUrl) {
        return null;
    }

    await deleteCachedUrl(shortCode);

    return deletedUrl;
};

module.exports = {
    createShortUrl,
    getUrlByShortCode,
    incrementClickCount,
    deleteShortUrl
};