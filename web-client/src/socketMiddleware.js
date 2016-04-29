import socket from './socket';
import { includes } from 'lodash';

const outgoingActions = [
  'OUTGOING_MESSAGE',
  'SET_DISPLAY_NAME',
];

const socketMiddleware = () => next => ({ type, payload }) => {
  if (includes(outgoingActions, type)) {
    socket.emit('action', { type, payload });
  } else if (type === 'INCOMING_MESSAGE') {
    socket.emit('action', {
      type: 'MESSAGE_STATUS_CHANGED',
      payload: {
        id: payload.id,
        from: payload.from,
        status: 'delivered',
      },
    });
  }
  return next({ type, payload });
};

export default socketMiddleware;
