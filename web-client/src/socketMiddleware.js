import socket from './socket';

const socketMiddleware = store => next => ({ type, payload }) => {
  if (type === 'OUTGOING_MESSAGE') {
    socket.emit('action', { type, payload });
  }
  return next({ type, payload });
};

export default socketMiddleware;
