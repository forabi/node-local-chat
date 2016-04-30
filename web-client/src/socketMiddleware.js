import * as io from 'socket.io-client';
import { includes } from 'lodash';

const outgoingActions = [
  'OUTGOING_MESSAGE',
  'SET_DISPLAY_NAME',
];

let chatSocket;

const socketMiddleware = store => next => ({ type, payload }) => {
  if (includes(outgoingActions, type)) {
    chatSocket.emit('action', { type, payload });
  } else if (type === 'INCOMING_MESSAGE') {
    chatSocket.emit('action', {
      type: 'MESSAGE_STATUS_CHANGED',
      payload: {
        id: payload.id,
        from: payload.from,
        status: 'delivered',
      },
    });
  } else if (type === 'SET_SERVER_ADDRESS') {
    // Chat socket switching to another server...
    if (chatSocket) {
      chatSocket.io.disconnect();
    }
    chatSocket = io.connect(payload);
    chatSocket.on('action', action => store.dispatch(action));
  }
  return next({ type, payload });
};

export default socketMiddleware;
