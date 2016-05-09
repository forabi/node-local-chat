const http = require('http');
const bonjour = require('bonjour')();
const express = require('express');
const socketIO = require('socket.io');
const getPort = require('get-port');
const clientRouter = require('./router');
const log = require('debug')('local-chat-web-client');
const filter = require('lodash/filter');
const assign = require('lodash/assign');
const Server = require('../server/Server');

const app = express();

app.use('/', clientRouter);

const httpServer = http.createServer(app);
const io = socketIO(httpServer);

httpServer.listen(3000, () => {
  const { address, port } = httpServer.address();
  log(`Web client is up at ${address}:${port}`);
  const match = server => {
    const doesMatch = Boolean(server.type === 'http' && server.txt && server.txt.localchat);
    log(
      `${server.name} provides LocalChat?`,
      doesMatch
    );
    return doesMatch;
  };

  const bonjourBrowser = bonjour.find({ type: 'http' });

  io.on('connection', socket => {
    const updateServers = () => {
      console.log('servers', filter(bonjourBrowser.services, match));
      socket.emit('action', {
        type: 'SET_SERVERS',
        payload: filter(bonjourBrowser.services, match).map(server => (
          server.referer ? assign({ }, server, { hostname: server.referer.address || 'localhost' }) :
            assign({ }, server, { hostname: server.addresses[0] || 'localhost' })
        )),
      });
    };

    bonjourBrowser.on('up', updateServers);
    bonjourBrowser.on('down', updateServers);
    updateServers();

    socket.on('action', action => {
      switch (action.type) {
        case 'CREATE_NEW_SERVER':
          getPort().then(serverPort => {
            new Server(action.payload.name)
              .start(serverPort, 'localhost');
          }).then(() => updateServers());
          break;
        default:
          return;
      }
    });
  });

  bonjourBrowser.start();
});
