import { createStore, combineReducers, applyMiddleware } from 'redux';
import clients from './clients';
import conversations from './conversations';
import activeConversationId from './activeConversationId';
import drafts from './drafts';
import socket from './socket';
import socketMiddleware from './socketMiddleware';

const reducers = combineReducers({
  clients,
  conversations,
  activeConversationId,
  drafts,
});

const store = createStore(reducers, applyMiddleware(socketMiddleware));

store.subscribe(() => console.log('Store updated', store.getState()));

socket.on('action', action => console.log(action));
socket.on('action', action => store.dispatch(action));

export default store;
