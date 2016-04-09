import React from 'react';
import { render } from 'react-dom';
import store from './store';
import App from './components/App';
import { Provider as ReduxProvider } from 'react-redux';

render((
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
), document.getElementById('container'));
