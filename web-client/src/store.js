import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import clients from './clients';
import messages from './messages';
import activeConversationId from './activeConversationId';
import socket from './socket';
import clientId from './clientId';
import displayName from './displayName';
import socketMiddleware from './socketMiddleware';

const reducers = combineReducers({
  displayName,
  clientId,
  clients,
  activeConversationId,
  messages,
});

const store = createStore(reducers,
  compose(
    applyMiddleware(
      socketMiddleware
    ),
    (process.env.NODE_ENV !== 'production' && window.devToolsExtension) ?
      window.devToolsExtension() : f => f
  )
);

socket.on('action', action => store.dispatch(action));

export default store;
