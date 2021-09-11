/*
 * Title: Token Handler
 * Description: Handler to to handle tokens
 * Author: Naimur Rahaman
 * Date: 10/09/2021
 *
 */

// module scadffolding
const handler = {};

// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { createRandomString } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');

handler.tokenHandler = (requestedProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    if (acceptedMethods.indexOf(requestedProperties.method) > -1) {
        handler._token[requestedProperties.method](requestedProperties, callback);
    } else {
        callback(405);
    }
};

// users scaffolding
handler._token = {};

// post request handling
handler._token.post = (requestedProperties, callback) => {
    const phone =
        typeof requestedProperties.body.phone === 'string' &&
        requestedProperties.body.phone.trim().length === 11
            ? requestedProperties.body.phone
            : false;
    const password =
        typeof requestedProperties.body.password === 'string' &&
        requestedProperties.body.password.trim().length > 0
            ? requestedProperties.body.password
            : false;

    if (phone && password) {
        data.read('users', phone, (err2, userData) => {
            const hashedPassword = hash(password);
            if (hashedPassword === parseJSON(userData).password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    id: tokenId,
                    phone,
                    expires,
                };

                // store the token
                data.create('tokens', tokenId, tokenObject, (err3) => {
                    if (!err3) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server side!',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'Password is not valid',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request !',
        });
    }
};

// get request handling
handler._token.get = (requestedProperties, callback) => {
    // check id number is valid
    const id =
        typeof requestedProperties.queryStringObject.id === 'string' &&
        requestedProperties.queryStringObject.id.trim().length === 20
            ? requestedProperties.queryStringObject.id
            : false;
    if (id) {
        // looking up the token
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, {
                    error: 'Requested token was not found!',
                });
            }
        });
    } else {
        callback(404, {
            error: 'Error: Requested token was not found!',
        });
    }
};

// put request handling
handler._token.put = (requestedProperties, callback) => {
    const id =
        typeof requestedProperties.body.id === 'string' &&
        requestedProperties.body.id.trim().length === 20
            ? requestedProperties.body.id
            : false;
    const extend =
        typeof requestedProperties.body.extend === 'boolean' &&
        requestedProperties.body.extend === true
            ? requestedProperties.body.extend
            : false;

    if (id && extend) {
        data.read('tokens', id, (err, tokenData) => {
            const tokenObject = parseJSON(tokenData);
            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                data.update('tokens', id, tokenObject, (err1) => {
                    if (!err1) {
                        callback(200, {
                            message: 'Your token has been extendes!',
                        });
                    } else {
                        callback(500, { error: 'There was something error in serverside!' });
                    }
                });
            } else {
                callback(400, {
                    error: 'Token already expired!',
                });
            }
        });
    } else {
        callback(500, {
            error: 'There was aproblem in your request!',
        });
    }
};

// delete request handling
handler._token.delete = (requestedProperties, callback) => {
    const id =
        typeof requestedProperties.body.id === 'string' &&
        requestedProperties.body.id.trim().length === 20
            ? requestedProperties.body.id
            : false;
    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                data.delete('tokens', id, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'Token deleted successfully ',
                        });
                    } else {
                        callback(500, {
                            error: 'There was a problem in server side ',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in server side ',
                });
            }
        });
    }
};

handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone === phone) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;
