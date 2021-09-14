/*
 * Title: Check Handler
 * Description: Check handler to user defined check
 * Author: Naimur Rahaman
 * Date: 12/09/2021
 *
 */
// module scadffolding
const handler = {};

// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

handler.checkHandler = (requestedProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    if (acceptedMethods.indexOf(requestedProperties.method) > -1) {
        handler._check[requestedProperties.method](requestedProperties, callback);
    } else {
        callback(405);
    }
};

// users scaffolding
handler._check = {};

// post request handling
handler._check.post = (requestedProperties, callback) => {
    
};

// get request handling
handler._check.get = (requestedProperties, callback) => {
    
};

// put request handling
handler._check.put = (requestedProperties, callback) => {
    
    
};

// delete request handling
handler._check.delete = (requestedProperties, callback) => {
    
};

module.exports = handler;
