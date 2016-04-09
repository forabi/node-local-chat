'use strict';
const bonjour = require('bonjour')();
const username = require('username');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const getPort = require('get-port');
const _ = require('lodash');
const clientRouter = require('./web-client/router');
const Promise = require('bluebird');
const logger = require('winston');

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);


app.use('/', clientRouter);

Promise.all([3002, getPort()]).then(ports => {
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

  // const getOnlineChatServices = () => (
  //   _.filter(browser.services,
  //     service => service.name !== myService.name &&
  //       _.includes(service.subtypes, 'LocalChat'))
  // );

  const getOnlineChatServices = () => (
    [{ name: 'other' }]
  );

  browser.on('up', () => {
    const chatServices = getOnlineChatServices();
    logger.info('Online LocalChat services:', _.map(chatServices, s => s.name).join() || 'none');
    io.emit('action', { type: 'CLIENTS_UPDATED', payload: chatServices });
  });

  io.on('connection', socket => {
    logger.info('New client connected');
    socket.emit('action', { type: 'CLIENTS_UPDATED', payload: getOnlineChatServices() });
    socket.on('action', (action) => {
      switch (action.type) {
        case 'OUTGOING_MESSAGE':
          io.to(action.payload.to).emit('INCOMING_MESSAGE', action.payload);
          break;
        default:
          return;
      }
    });
  });

  httpServer.listen(httpPort, () => {
    logger.info(`Socket.io Server is listening on port ${httpPort}`);
    logger.info(`Web client is up on http://localhost:${httpPort}/`);
  });
}).catch(e => {
  logger.error('Unexpected error', e);
});
