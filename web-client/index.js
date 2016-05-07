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

httpServer.listen(3000, 'localhost', () => {
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

    socket.on('action', async action => {
      switch (action.type) {
        case 'CREATE_NEW_SERVER':
          try {
            console.log('trying...', action);
            await new Server(action.payload.name).start({
              port: await getPort(),
              hostname: 'localhost',
            });
            console.log('server created');
            updateServers();
          } catch (e) {
            console.error('err', e);
          }
          break;
        default:
          return;
      }
    });
  });

  bonjourBrowser.start();
});
