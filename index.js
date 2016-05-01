const log = require('debug')('local-chat-server');
const Server = require('./Server');

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
