const {
    createShortUrl,
    getUrlByShortCode,
    incrementClickCount,
    deleteShortUrl
} = require("../services/urlService");

const validator = require("validator");
const createUrl = async (req, res) => {
    try {
        const { originalUrl, expiresAt } = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                message: "originalUrl is required"
            });
        }
if (!validator.isURL(originalUrl, {
    protocols: ["http", "https"],
    require_protocol: true
})) {
    return res.status(400).json({
        message: "Please provide a valid URL with http:// or https://"
    });
}
if (expiresAt) {
    const expirationDate = new Date(expiresAt);

    if (
        Number.isNaN(expirationDate.getTime()) ||
        expirationDate <= new Date()
    ) {
        return res.status(400).json({
            message: "expiresAt must be a valid future date"
        });
    }
}

        const url = await createShortUrl(originalUrl, expiresAt || null);

        return res.status(201).json({
            message: "Short URL created successfully",
            data: {
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
                expiresAt: url.expiresAt,
                clickCount: url.clickCount,
                createdAt: url.createdAt
            }
        });
    } catch (error) {
        console.error("Create URL error:", error);

        return res.status(500).json({
            message: "Failed to create short URL"
        });
    }
};

const redirectToOriginalUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const url = await getUrlByShortCode(shortCode);

        if (!url) {
            return res.status(404).json({
                message: "Short URL not found or expired"
            });
        }

        await incrementClickCount(shortCode);

        return res.redirect(url.originalUrl);
    } catch (error) {
        console.error("Redirect error:", error);

        return res.status(500).json({
            message: "Failed to redirect"
        });
    }
};

const getUrlAnalytics = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const url = await getUrlByShortCode(shortCode);

        if (!url) {
            return res.status(404).json({
                message: "Short URL not found or expired"
            });
        }

        return res.status(200).json({
            data: {
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
                clickCount: url.clickCount,
                lastAccessedAt: url.lastAccessedAt,
                createdAt: url.createdAt,
                expiresAt: url.expiresAt
            }
        });
    } catch (error) {
        console.error("Analytics error:", error);

        return res.status(500).json({
            message: "Failed to fetch URL analytics"
        });
    }
};

const deleteUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const deletedUrl = await deleteShortUrl(shortCode);

        if (!deletedUrl) {
            return res.status(404).json({
                message: "Short URL not found"
            });
        }

        return res.status(200).json({
            message: "Short URL deleted successfully",
            data: {
                shortCode: deletedUrl.shortCode,
                originalUrl: deletedUrl.originalUrl
            }
        });
    } catch (error) {
        console.error("Delete URL error:", error);

        return res.status(500).json({
            message: "Failed to delete short URL"
        });
    }
};

module.exports = {
    createUrl,
    redirectToOriginalUrl,
    getUrlAnalytics,
    deleteUrl
};