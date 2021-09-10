/*
 *
 *   Title: Monitoring Application
 *   Description: A Restful API to monitor UP or DownTime of links defined by user
 *   Author: Naimur Rahaman
 *   Date: 29/08/2021
 *
 */

//  dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

//  App scaffolding
const app = {};

//  configuration
app.config = {
    port: 3000,
};

//  create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Server Listening at ${environment.port}`);
    });
};

//  handle req res
app.handleReqRes = handleReqRes;

//  start the server
app.createServer();
