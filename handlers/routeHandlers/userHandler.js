/*
 * Title: User Handler
 * Description: Handler to to handle user related route
 * Author: Naimur Rahaman
 * Date: 05/09/2021
 *
 */

// module scadffolding
const handler = {};

// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

handler.userHandler = (requestedProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    if (acceptedMethods.indexOf(requestedProperties.method) > -1) {
        handler._users[requestedProperties.method](requestedProperties, callback);
    } else {
        callback(405);
    }
};

// users scaffolding
handler._users = {};

// post request handling
handler._users.post = (requestedProperties, callback) => {
    const firstName =
        typeof requestedProperties.body.firstName === 'string' &&
        requestedProperties.body.firstName.trim().length > 0
            ? requestedProperties.body.firstName
            : false;
    const lastName =
        typeof requestedProperties.body.lastName === 'string' &&
        requestedProperties.body.lastName.trim().length > 0
            ? requestedProperties.body.lastName
            : false;
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
    const tosAgreement =
        typeof requestedProperties.body.tosAgreement === 'boolean'
            ? requestedProperties.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that user doesnt exist
        data.read('users', phone, (err, users) => {
            if (err) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // store the user to db
                data.create('users', phone, userObject, (error) => {
                    if (!error) {
                        callback(200, {
                            message: 'User was created successfully',
                        });
                    } else {
                        callback(500, {
                            error: 'There was an error creating user!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in server side',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

// get request handling
handler._users.get = (requestedProperties, callback) => {
    // check phone number is valid
    const phone =
        typeof requestedProperties.queryStringObject.phone === 'string' &&
        requestedProperties.queryStringObject.phone.trim().length === 11
            ? requestedProperties.queryStringObject.phone
            : false;
    if (phone) {
        const token =
            typeof requestedProperties.headerObject.token === 'string'
                ? requestedProperties.headerObject.token
                : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                // rest of the code
                // looking up the user
                data.read('users', phone, (err, u) => {
                    const user = { ...parseJSON(u) };
                    if (!err && user) {
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, {
                            error: 'Requested user was not found!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication faild!',
                });
            }
        });
    } else {
        callback(404, {
            error: 'Error: Requested user was not found!',
        });
    }
};

// put request handling
handler._users.put = (requestedProperties, callback) => {
    const firstName =
        typeof requestedProperties.body.firstName === 'string' &&
        requestedProperties.body.firstName.trim().length > 0
            ? requestedProperties.body.firstName
            : false;
    const lastName =
        typeof requestedProperties.body.lastName === 'string' &&
        requestedProperties.body.lastName.trim().length > 0
            ? requestedProperties.body.lastName
            : false;
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
    if (phone) {
        if (firstName || lastName || password) {
            const token =
                typeof requestedProperties.headerObject.token === 'string'
                    ? requestedProperties.headerObject.token
                    : false;

            tokenHandler._token.verify(token, phone, (tokenId) => {
                if (tokenId) {
                    // rest of the code
                    // looking up the user
                    data.read('users', phone, (err, uData) => {
                        const userData = { ...parseJSON(uData) };
                        if (!err && uData) {
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.password = hash(password);
                            }
                            data.update('users', phone, userData, (err2) => {
                                if (!err2) {
                                    callback(200, {
                                        message: 'User was updated successfully',
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
                } else {
                    callback(403, {
                        error: 'Authentication faild!',
                    });
                }
            });
        }
    }
};

// delete request handling
handler._users.delete = (requestedProperties, callback) => {
    const phone =
        typeof requestedProperties.body.phone === 'string' &&
        requestedProperties.body.phone.trim().length === 11
            ? requestedProperties.body.phone
            : false;
    if (phone) {
        const token =
            typeof requestedProperties.headerObject.token === 'string'
                ? requestedProperties.headerObject.token
                : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                // rest of the code
                data.read('users', phone, (err, uData) => {
                    if (!err && uData) {
                        data.delete('users', phone, (err2) => {
                            if (!err2) {
                                callback(200, {
                                    message: 'User deleted successfully ',
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
            } else {
                callback(403, {
                    error: 'Authentication faild!',
                });
            }
        });
    }
};

module.exports = handler;
