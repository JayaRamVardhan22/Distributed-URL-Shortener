const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: true,
            trim: true
        },

        shortCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true
        },

        expiresAt: {
            type: Date,
            default: null
        },

        clickCount: {
            type: Number,
            default: 0,
            min: 0
        },

        lastAccessedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;