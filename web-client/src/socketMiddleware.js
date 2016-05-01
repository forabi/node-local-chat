import * as io from 'socket.io-client';
import clientSocket from './clientSocket';
import { includes } from 'lodash';

const outgoingActions = [
  'OUTGOING_MESSAGE',
  'SET_DISPLAY_NAME',
];

const outgoingClientActions = [
  'CREATE_NEW_SERVER',
];

let chatSocket;

const socketMiddleware = store => next => ({ type, payload }) => {
  if (includes(outgoingClientActions, type)) {
    clientSocket.emit('action', { type, payload });
  } else if (includes(outgoingActions, type)) {
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
    chatSocket.on('disconnect', () => {
      store.dispatch('CHAT_SERVER_DISCONNECTED');
    });
    chatSocket.on('reconnect', () => {
      store.dispatch('CHAT_SERVER_RECONNECTED');
    });
  }
  return next({ type, payload });
};

export default socketMiddleware;
