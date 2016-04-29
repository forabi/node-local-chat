import React from 'react';
import { render } from 'react-dom';
import ReduxApp from './ReduxApp';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { AppContainer } from 'react-hot-loader';

injectTapEventPlugin();

const mountElement = document.getElementById('container');

render(<AppContainer component={ReduxApp} />, mountElement);

if (module.hot) {
  module.hot.accept('./ReduxApp', () => {
    render(<AppContainer component={ReduxApp} />, mountElement);
  });
}
