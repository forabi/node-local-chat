const http = require('http');
const bonjour = require('bonjour')();
const express = require('express');
const socketIO = require('socket.io');
const pkg = require('../package.json');
const clientRouter = require('./router');
const log = require('debug')('local-chat-web-client');

const app = express();

app.use('/', clientRouter);

const httpServer = http.createServer(app);
const io = socketIO(httpServer);

httpServer.listen(3000, 'localhost', () => {
  const { address, port } = httpServer.address();
  log(`Web client is up at ${address}:${port}`);
  const match = {
    type: 'http',
    txt: {
      localchat: pkg.version,
    },
  };

  const bonjourBrowser = bonjour.find(match);

  bonjourBrowser.on('up', server => {
    log('Chat server up', server);
    io.emit('action', {
      type: 'CHAT_SERVER_UP',
      payload: server,
    });
  });

  bonjourBrowser.on('down', server => {
    io.emit('action', {
      type: 'CHAT_SERVER_DOWN',
      payload: server,
    });
  });

  bonjourBrowser.start();

  io.on('connection', socket => {
    socket.emit('action', {
      type: 'SET_SERVERS',
      payload: bonjourBrowser.services,
    });
  });
});
