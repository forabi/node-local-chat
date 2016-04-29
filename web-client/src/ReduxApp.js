import React from 'react';
import store from './store';
import App from './components/App';
import { Provider as ReduxProvider } from 'react-redux';

const ReduxApp = () => (
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
);

export default ReduxApp;
