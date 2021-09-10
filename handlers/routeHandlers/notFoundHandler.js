/*
 * Title: Not gound Handler
 * Description: Not Found Handler
 * Author: Naimur Rahaman
 * Date: 31/08/2021
 *
 */

// module scadffolding
const handler = {};

handler.notFoundHandler = (requestedProperties, callback) => {
    callback(404, {
        message: 'Your Requested Url Was not found',
    });
};

module.exports = handler;
