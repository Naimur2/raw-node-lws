/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Naimur Rahaman
 * Date: 31/08/2021
 *
 */

// module scadffolding
const handler = {};

handler.sampleHandler = (requestedProperties, callback) => {
    callback(200, {
        message: 'This is a message',
    });
};

module.exports = handler;
