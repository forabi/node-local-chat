'use strict';
const bonjour = require('bonjour')();
const username = require('username');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const getPort = require('get-port');
const clientRouter = require('./web-client/router');
const useragent = require('ua-parser-js');
const Promise = require('bluebird');
const logger = require('winston');
const memoize = require('lodash/memoize');
const pkg = require('./package.json');

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);


app.use('/', clientRouter);

Promise.all([3002, getPort()]).then(ports => {
  const httpPort = ports[0];
  const bonjourPort = ports[1];
  logger.debug('Got available ports:', httpPort, bonjourPort);

  io.on('connection', socket => {
    logger.info('New client connected');

    const getFallbackDisplayName = memoize(id => {
      const header = io.sockets.connected[id].request.headers['user-agent'];
      const ua = useragent(header);
      const browser = ua.browser.name;
      const os = ua.os.name;
      return `${browser} on ${os}`;
    });

    const getClientInfo = id => ({
      id,
      displayName: getFallbackDisplayName(id),
    });

    const getClients = () => (
      Object.keys(io.sockets.connected).map(getClientInfo)
    );

    socket.broadcast.emit('action', {
      type: 'NEW_CLIENT',
      payload: getClientInfo(socket.id),
    });

    socket.on('reconnect', () => {
      socket.broadcast.emit('action', {
        type: 'CLIENT_ONLINE',
        payload: socket.id,
      });
    });

    socket.on('disconnect', () => {
      socket.broadcast.emit('action', {
        type: 'CLIENT_OFFLINE',
        payload: socket.id,
      });
    });

    socket.emit('action', {
      type: 'SET_CLIENT_ID',
      payload: socket.id,
    });

    socket.emit('action', {
      type: 'CLIENTS_UPDATED',
      payload: getClients(),
    });

    socket.on('action', action => {
      logger.debug('Server received action', action);
      switch (action.type) {
        case 'SET_DISPLAY_NAME':
          // socketNames[socket.id] = action.payload;
          io.emit('CLIENTS_UPDATED', getClients());
          break;
        case 'OUTGOING_MESSAGE':
          socket.broadcast.to(action.payload.to)
            .emit('action', {
              type: 'INCOMING_MESSAGE',
              payload: Object.assign({ }, action.payload, {
                from: socket.id,
                status: 'delivered',
                dateReceived: new Date,
              }),
            });
          socket.emit('action', {
            type: 'UPDATE_MESSAGE',
            payload: {
              id: action.payload.id,
              status: 'sent',
              dateSent: new Date,
            },
          });
          break;
        case 'MESSAGE_STATUS_CHANGED':
          socket.broadcast.to(action.payload.from)
            .emit('action', {
              type: 'UPDATE_MESSAGE',
              payload: {
                id: action.payload.id,
                status: 'delivered',
              },
            });
          break;
        default:
          return;
      }
    });
  });

  httpServer.listen(httpPort, 'localhost', () => {
    const address = httpServer.address();
    logger.info(`Socket.io Server is listening on port ${address.port}`);
    logger.info(`Web client is up on http://${address.address}:${address.port}/`);
    
    const options = {
      type: 'http',
      port: bonjourPort,
      txt: {
        localchat: pkg.version,
        address: address.address,
        port: address.port,
      },
    };

    try {
      options.name = `LocalChat (${username.sync()})`;
    } catch (e) {
      options.name = 'LocalChat (unknown username)';
    }

    bonjour.publish(options);
    logger.info(`Bonjour service published on port ${bonjourPort}`);
  });
}).catch(e => {
  logger.error('Unexpected error', e);
});
