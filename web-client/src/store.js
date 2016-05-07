import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import appSocket from './utils/appSocket';
import users from './reducers/users';
import inMemoryMessages from './reducers/inMemoryMessages';
import activeConversationId from './reducers/activeConversationId';
import userId from './reducers/userId';
import serverId from './reducers/serverId';
import servers from './reducers/servers';
import numVisits from './reducers/numVisits';
import promiseMiddleware from 'redux-promise';
import appSocketMiddleware from './middleware/appSocket';
import chatSocketMiddleware from './middleware/chatSocket';
import persistenceMiddleware from './middleware/persistence';
import messageStatusMiddleware from './middleware/messageStatus';
// import encryptionMiddleware from './middleware/encryption';

const reducers = combineReducers({
  userId,
  users,
  activeConversationId,
  inMemoryMessages,
  servers,
  serverId,
  numVisits,
});

const store = createStore(reducers,
  compose(
    applyMiddleware(
      promiseMiddleware,
      messageStatusMiddleware,
      persistenceMiddleware,
      // encryptionMiddleware,
      chatSocketMiddleware,
      appSocketMiddleware,
    ),
    (process.env.NODE_ENV !== 'production' && window.devToolsExtension) ?
      window.devToolsExtension() : f => f
  )
);

appSocket.on('action', store.dispatch);

export default store;
