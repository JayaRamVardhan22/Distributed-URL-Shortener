const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./src/middleware/errorHandler");

const connectDatabase = require("./src/config/database");
const { connectRedis } = require("./src/config/redis");
const urlRoutes = require("./src/routes/urlRoutes");

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const createUrlLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many URL creation requests. Please try again later."
    }
});

app.get("/", (req, res) => {
    res.json({
        message: "Distributed URL Shortener API is running",
        status: "OK"
    });
});

app.use("/api/urls", createUrlLimiter);
app.use("/", urlRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDatabase();
    await connectRedis();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();