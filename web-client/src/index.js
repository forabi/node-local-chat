import React from 'react';
import { render } from 'react-dom';
import store from './store';
import App from './components/App';
import { Provider as ReduxProvider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

render((
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
), document.getElementById('container'));
