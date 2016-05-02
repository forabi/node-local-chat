import * as io from 'socket.io-client';
import clientSocket from './clientSocket';
import { includes } from 'lodash';

const actionsForwarededToChatServer = [
  'OUTGOING_MESSAGE',
  'SET_DISPLAY_NAME',
  'UPDATE_MESSAGE',
];

const actionsForwaredToClientServer = [
  'CREATE_NEW_SERVER',
];

let chatSocket;

const socketMiddleware = store => next => ({ type, payload }) => {
  if (includes(actionsForwaredToClientServer, type)) {
    clientSocket.emit('action', { type, payload });
  } else if (includes(actionsForwarededToChatServer, type)) {
    chatSocket.emit('action', { type, payload });
  } else if (type === 'INCOMING_MESSAGE') {
    chatSocket.emit('action', {
      type: 'UPDATE_MESSAGE',
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
