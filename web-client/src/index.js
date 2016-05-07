import React from 'react';
import { render } from 'react-dom';
import ReduxApp from './ReduxApp';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { AppContainer } from 'react-hot-loader';

injectTapEventPlugin();

const mountElement = document.getElementById('container');

function renderApp() {
  render((
    <AppContainer>
      <ReduxApp />
    </AppContainer>
  ), mountElement);
}

if (module && module.hot) {
  module.hot.accept('./ReduxApp', renderApp);
}

renderApp();
