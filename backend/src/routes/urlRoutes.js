const express = require("express");

const {
    createUrl,
    redirectToOriginalUrl,
    getUrlAnalytics,
    deleteUrl
} = require("../controllers/urlController");

const router = express.Router();

// Create a short URL
router.post("/api/urls", createUrl);

// Get URL analytics
router.get("/api/urls/:shortCode", getUrlAnalytics);

router.delete("/api/urls/:shortCode", deleteUrl);

// Redirect short URL
router.get("/:shortCode", redirectToOriginalUrl);

module.exports = router;