'use strict';
const bonjour = require('bonjour')();
const username = require('username');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const getPort = require('get-port');
const _ = require('lodash');
const Promise = require('bluebird');
const logger = require('winston');

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);

app.use('/', express.static('./web-client'));

Promise.all([3001, getPort()]).then(ports => {
  const httpPort = ports[0];
  const bonjourPort = ports[1];
  logger.debug('Got available ports:', httpPort, bonjourPort);

  const options = {
    type: 'http',
    port: bonjourPort,
    subtypes: ['LocalChat'],
  };

  try {
    options.name = `LocalChat (${username.sync()})`;
  } catch (e) {
    options.name = 'LocalChat (unknown username)';
  }

  const myService = bonjour.publish(options);
  logger.info(`Bonjour service published on port ${bonjourPort}`);

  const browser = bonjour.find({ type: 'http' });

  const getOnlineChatServices = () => (
    _.filter(browser.services,
      service => service.name !== myService.name &&
        _.includes(service.subtypes, 'LocalChat'))
  );

  browser.on('up', () => {
    const chatServices = getOnlineChatServices();
    logger.info('Online LocalChat services:', _.map(chatServices, s => s.name).join() || 'none');
    io.emit('action', { type: 'SERVICES_UPDATED', payload: chatServices });
  });

  io.on('connection', socket => {
    logger.info('New client connected');
    socket.emit('action', { type: 'SERVICES_UPDATED', payload: getOnlineChatServices() });
  });

  httpServer.listen(httpPort, () => {
    logger.info(`Socket.io Server is listening on port ${httpPort}`);
    logger.info(`Web client is up on http://localhost:${httpPort}/`);
  });
}).catch(e => {
  logger.error('Unexpected error', e);
});
