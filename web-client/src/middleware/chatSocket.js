import * as io from 'socket.io-client';
import { includes } from 'lodash';
import actions from '../../../actions';

const forwarded = [
  actions.OUTGOING_MESSAGE,
  actions.OUTGOING_MESSAGE_UPDATE,
  actions.SET_DISPLAY_NAME,
  actions.UPDATE_USER_PROFILE,
];

let chatSocket;

const chatSocketMiddleware = ({ dispatch }) => next => async ({ type, payload }) => {
  if (!chatSocket) {
    // @TODO
  } else if (includes(forwarded, type)) {
    chatSocket.emit('action', { type, payload });
  } else if (type === actions.SET_SERVER_ADDRESS) {
    // Chat socket switching to another server...
    if (chatSocket) chatSocket.io.disconnect();
    chatSocket = io.connect(payload);
    chatSocket.on('action', action => dispatch(action));
    chatSocket.on('connect', () => dispatch({ type: actions.SOCKET_CONNECTED }));
    chatSocket.on('disconnect', () => dispatch({ type: actions.SOCKET_DISCONNECTED }));
    chatSocket.on('reconnect', () => dispatch({ type: actions.SOCKET_RECONNECTED }));
  }
  return next({ type, payload });
};

export default chatSocketMiddleware;
