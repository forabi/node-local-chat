import socket from './socket';
import includes from 'lodash/includes';

const outgoingActions = [
  'OUTGOING_MESSAGE',
  'SET_DISPLAY_NAME',
];

const socketMiddleware = () => next => ({ type, payload }) => {
  if (includes(outgoingActions, type)) {
    socket.emit('action', { type, payload });
  }
  return next({ type, payload });
};

export default socketMiddleware;
