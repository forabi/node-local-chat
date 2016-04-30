const http = require('http');
const bonjour = require('bonjour')();
const express = require('express');
const socketIO = require('socket.io');
const pkg = require('../package.json');
const clientRouter = require('./router');
const log = require('debug')('local-chat-web-client');
const filter = require('lodash/filter');

const app = express();

app.use('/', clientRouter);

const httpServer = http.createServer(app);
const io = socketIO(httpServer);

httpServer.listen(3000, 'localhost', () => {
  const { address, port } = httpServer.address();
  log(`Web client is up at ${address}:${port}`);
  const match = server => {
    log(
      `${server.name} provides LocalChat?`,
      Boolean(server.type === 'http' && server.txt && server.txt.localchat)
    );
    return Boolean(server.type === 'http' && server.txt && server.txt.localchat);
  };

  const bonjourBrowser = bonjour.find(match);

  io.on('connection', socket => {
    const updateServers = () => {
      socket.emit('action', {
        type: 'SET_SERVERS',
        payload: filter(bonjourBrowser.services, match),
      });
    };

    bonjourBrowser.on('up', updateServers);
    bonjourBrowser.on('down', updateServers);
    updateServers();
  });

  bonjourBrowser.start();
});
