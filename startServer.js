import debug from 'debug';
import Server from './server/Server';

const log = debug('local-chat-server');
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
