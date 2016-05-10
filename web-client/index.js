import http from 'http';
import _bonjour from 'bonjour';
import express from 'express';
import socketIO from 'socket.io';
import getPort from 'get-port';
import clientRouter from './router';
import debug from 'debug';

import filter from 'lodash/filter';
import Server from '../server/Server';

const bonjour = _bonjour();

const log = debug('local-chat-web-client');

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

    socket.on('action', async action => {
      switch (action.type) {
        case 'CREATE_NEW_SERVER':
          try {
            await new Server(action.payload.name).start({
              port: await getPort(),
            });
            updateServers();
          } catch (e) {
            log('Error starting server:', e);
          }
          break;
        default:
          return;
      }
    });
  });

  bonjourBrowser.start();
});
