import Promise from 'bluebird';
import http from 'http';
import socketIO from 'socket.io';
import express from 'express';
import uuid from 'node-uuid';
import cors from 'express-cors';
import Bonjour from 'bonjour';
import _ from 'lodash';
import getPort from 'get-port';
// import { User, Token } from './db';
import pkg from '../package.json';
import debug from 'debug';

const bonjour = Bonjour();

const log = debug('local-chat-server');

export default class ChatServer {
  bonjourService;
  httpServer;
  io;

  constructor(name) {
    this.name = name;
  }

  async onSocketConnected(socket) {
    log('New client connected');

    socket.on('reconnect', () => {
      this.onSocketReconnected(socket);
    });

    socket.on('disconnect', () => {
      this.onSocketDisconnected(socket);
    });

    socket.on('action', action => {
      this.onSocketAction(socket, action);
    });
  }

  async onSocketAction(socket, { type, payload }) {
    switch (type) {
      case 'AUTHENTICATE':
        (async () => {
          try {
            const tokenId = payload;
            const token = await Token.findById(
              tokenId,
              {
                include: [User],
              }
            );
            if (token !== null && token.User !== null) {
              const user = token.User;
              socket.user = user;
              socket.join(user.id);
              socket.emit('action', {
                type: 'SET_USER_ID',
                payload: user.id,
              });

              socket.broadcast.emit('action', {
                type: 'USER_ONLINE',
                payload: socket.user.id,
              });

              socket.emit('action', {
                type: 'SET_USERS',
                payload: await User.findAll(),
              });
            } else {
              log('Failed to authenticate', payload);
              socket.emit('action', {
                type: 'AUTHENTICATION_FAILURE',
                payload: { },
              });
            }
          } catch (e) {
            log('Error', e);
          }
        })();
        break;
      case 'CREATE_USER':
        (async () => {
          const user = await User.create({ ...payload, id: uuid.v4() });
          const token = await Token.create({ id: uuid.v4(), userId: user.id });
          socket.emit('action', {
            type: 'USER_CREATED',
            payload: {
              ...user,
              token,
            },
          });
        })();
        break;
      case 'UPDATE_USER':
        await socket.user.update(
          _.pick(payload, 'status', 'name', 'picture')
        );
        socket.broadcast.emit('action', {
          type: 'UPDATE_USER',
          payload: socket.user,
        });
        break;
      default:
        log(`Unknown action type "${type}"`);
        return;
    }
  }

  onSocketDisconnected(socket) {
    socket.broadcast.emit('action', {
      type: 'USER_OFFLINE',
      payload: _.chain(this.io.sockets.connected)
        .mapValues(s => s.user.id)
        .uniq()
        .value(),
    });
  }

  onSocketReconnected(socket) {
    socket.broadcast.emit('action', {
      type: 'USER_ONLINE',
      payload: socket.user,
    });
  }

  async start({ port }) {
    if (!port) {
      port = await getPort();
    }

    const app = express();
    app.use('*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      next();
    });

    this.httpServer = http.createServer(app);
    this.io = socketIO(this.httpServer);

    this.io.on('connection', this.onSocketConnected.bind(this));

    await Promise.fromCallback(
      cb => this.httpServer.listen(port, cb)
    );

    log(`HTTP server listening on ${port}`);

    this.bonjourService = bonjour.publish({
      type: 'http',
      name: this.name,
      port: await getPort(),
      txt: {
        port,
        localchat: pkg.version,
      },
    });

    log(
      `Bonjour service published on port ${this.bonjourService.host}:${this.bonjourService.port}`
    );
  }

  async stop() {
    await Promise.all([
      Promise.fromCallback(cb => this.bonjourService.stop(cb)),
      Promise.fromCallback(cb => this.httpServer.close(cb)),
    ]);
  }
}
