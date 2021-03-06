const log = require('debug')('local-chat-server');
const Server = require('./server/Server');

// @TODO get device name and os info
const server = new Server('f-laptop-localchat');

server
  .start(3001, 'localhost')
  .catch(e => {
    log('Unexpected error', e);
  });

process.on('SIGINT', () => {
  server.stop();
  process.exit();
});
