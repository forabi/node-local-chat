import React from 'react';
import store from './store';
import App from './components/App';
import { Provider as ReduxProvider } from 'react-redux';

const reduxApp = <ReduxProvider store={store}><App /></ReduxProvider>;

export default reduxApp;
