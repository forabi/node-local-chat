import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import clients from './clients';
import messages from './messages';
import activeConversationId from './activeConversationId';
import clientSocket from './clientSocket';
import clientId from './clientId';
import displayName from './displayName';
import serverAddress from './serverAddress';
import servers from './servers';
import socketMiddleware from './socketMiddleware';

const reducers = combineReducers({
  displayName,
  clientId,
  clients,
  activeConversationId,
  messages,
  servers,
  serverAddress,
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

clientSocket.on('action', action => store.dispatch(action));

export default store;
