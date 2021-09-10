/*
 *
 *   Title: Monitoring Application
 *   Description: A Restful API to monitor UP or DownTime of links defined by user
 *   Author: Naimur Rahaman
 *   Date: 29/08/2021
 *
 */

//  dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');

const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');

//  module scaffolding
const handler = {};

//  handle req res
handler.handleReqRes = (req, res) => {
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parseUrl.query;
    const headerObject = req.headers;

    const requestedProperties = {
        parseUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headerObject,
    };

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();
        requestedProperties.body = parseJSON(realData);

        chosenHandler(requestedProperties, (statusCode, payLoad) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payLoad = typeof payLoad === 'object' ? payLoad : {};
            const payLoadString = JSON.stringify(payLoad);

            // return the final response
            res.setHeader('Content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(payLoadString);
        });
    });
};

module.exports = handler;
