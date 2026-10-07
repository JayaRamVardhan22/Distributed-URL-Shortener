const CHARACTERS =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const encodeBase62 = (number) => {
    if (!Number.isInteger(number) || number < 0) {
        throw new Error("Number must be a non-negative integer");
    }

    if (number === 0) {
        return CHARACTERS[0];
    }

    let result = "";

    while (number > 0) {
        result = CHARACTERS[number % 62] + result;
        number = Math.floor(number / 62);
    }

    return result;
};

module.exports = {
    encodeBase62
};