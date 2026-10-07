const crypto = require("crypto");

const CHARACTERS =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const generateShortCode = (length = 7) => {
    let shortCode = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, CHARACTERS.length);
        shortCode += CHARACTERS[randomIndex];
    }

    return shortCode;
};

module.exports = {
    generateShortCode
};