const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const cors = require('express-cors');
const bonjour = require('bonjour')();
const log = require('debug')('local-chat-server');
const { assign, memoize } = require('lodash');
const Promise = require('bluebird');
const pkg = require('../package.json');
const useragent = require('ua-parser-js');
const getPort = require('get-port');

class ChatServer {
  constructor(name) {
    if (name) {
      this.name = name;
    }
  }

  getFallbackDisplayName() {
    return memoize(id => {
      const header = this.io.sockets.connected[id].request.headers['user-agent'];
      const ua = useragent(header);
      const browser = ua.browser.name;
      const os = ua.os.name;
      return `${browser} on ${os}`;
    });
  }

  getClients() {
    return Object.keys(this.io.sockets.connected).map(this.getClientInfo.bind(this));
  }

  getClientInfo(id) {
    return {
      id,
      displayName: this.getFallbackDisplayName()(id),
    };
  }

  onSocketConnected(socket) {
    log('New client connected');

    socket.broadcast.emit('action', {
      type: 'NEW_CLIENT',
      payload: this.getClientInfo(socket.id),
    });

    socket.on('reconnect', () => {
      this.onSocketReconnected(socket);
    });

    socket.on('disconnect', () => {
      this.onSocketDisconnected(socket);
    });

    socket.on('action', action => {
      this.onSocketAction(socket, action);
    });

    socket.emit('action', {
      type: 'SET_CLIENT_ID',
      payload: socket.id,
    });

    socket.emit('action', {
      type: 'CLIENTS_UPDATED',
      payload: this.getClients(),
    });
  }

  onSocketReconnected(socket) {
    socket.broadcast.emit('action', {
      type: 'CLIENT_ONLINE',
      payload: socket.id,
    });
  }

  onSocketDisconnected(socket) {
    socket.broadcast.emit('action', {
      type: 'CLIENT_OFFLINE',
      payload: socket.id,
    });
  }

  onSocketAction(socket, action) {
    log('Server received action', action);
    switch (action.type) {
      case 'SET_DISPLAY_NAME':
        // @TODO
        break;
      case 'OUTGOING_MESSAGE':
        socket.broadcast.to(action.payload.to)
          .emit('action', {
            type: 'INCOMING_MESSAGE',
            payload: assign({ }, action.payload, {
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
  }

  start(port, address = 'localhost') {
    const app = express();

    app.use(cors({
      allowedOrigins: ['*'],
    }));

    this.httpServer = http.createServer(app);
    this.io = socketIO(this.httpServer);

    this.io.on('connection', this.onSocketConnected.bind(this));

    return getPort().then(bonjourPort => (
      new Promise((resolve, reject) => {
        log(`Chat server is up on http://${address}:${port}/`);

        this.httpServer.on('error', err => reject(err));

        this.httpServer.listen(port, address, () => {
          const options = {
            type: 'http',
            port: bonjourPort,
            name: this.name,
            txt: {
              localchat: pkg.version,
              address, port,
            },
          };

          this.bonjourService = bonjour.publish(options);
          log('Bonjour service published', options);
          return resolve(options);
        });
      })
    ));
  }

  stop() {
    return Promise.all([
      Promise.fromCallback(cb => this.bonjourService.stop(cb)),
      Promise.fromCallback(cb => this.httpServer.close(cb)),
    ]);
  }
}

module.exports = ChatServer;
