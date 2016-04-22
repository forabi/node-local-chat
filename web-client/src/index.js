import React from 'react';
import { render } from 'react-dom';
import App from './reduxApp';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { AppContainer } from 'react-hot-loader';

injectTapEventPlugin();

const mountElement = document.getElementById('container');


render((
  <AppContainer component={App} />
), mountElement);

if (module.hot) {
  module.hot.accept('./reduxApp', () => {
    render(
        <AppContainer component={ require('./reduxApp').default } />,
        mountElement
    );
  });
}
