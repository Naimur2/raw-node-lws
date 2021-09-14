/*
 * Title: Notifications Library
 * Description: Functions to notify users
 * Author: Naimur Rahaman
 * Date: 14/09/2021
 *
 */

// dependencies
const https = require('https');

// module scaffolding
const notifications = {};
// send sms to user using twilio
notifications.sendTwilioSms = (phone, msg, callback) => {
    const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false;
    const userMsg =
        typeof msg === 'string' && msg.trim().length > 1 && msg.trim().length <= 1600 ? msg : false;
};
