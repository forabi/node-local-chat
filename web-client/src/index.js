import React from 'react';
import { render } from 'react-dom';
import * as io from 'socket.io-client';
import store from './store';
import App from './components/App';
import { Provider as ReduxProvider } from 'react-redux';

const socket = io();

socket.on('action', action => {
  console.log('socket.io message:', action);
  store.dispatch(action);
});

render((
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
), document.getElementById('container'));
