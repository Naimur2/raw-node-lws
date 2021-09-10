/*
 * Title: Utilities
 * Description: Utilities
 * Author: Naimur Rahaman
 * Date: 07/09/2021
 *
 */

// module scaffolding
const utilities = {};

// dependencies
const crypto = require('crypto');
const environments = require('./environments');

// parse JSON to string object
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

// hash the sring
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        return crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
    }
    return false;
};

// create random string
utilities.createRandomString = (strLength) => {
    let length = strLength;
    length = typeof strLength === 'number' ? strLength : false;
    if (length) {
        const possibleString = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';
        for (let i = 0; i < strLength; i += 1) {
            const index = Math.floor(Math.random() * possibleString.length);
            const randomCharacter = possibleString.charAt(index);
            output += randomCharacter;
        }
        return output;
    }
    return false;
};

// export module
module.exports = utilities;
