import { includes } from 'lodash';
import appSocket from '../utils/appSocket';
import actions from '../../../actions';

const forwarded = [
  actions.CREATE_NEW_SERVER,
];

const appSocketMiddleware = () => next => async ({ type, payload }) => {
  if (includes(forwarded, type)) {
    appSocket.emit('action', { type, payload });
  }
  return next({ type, payload });
};

export default appSocketMiddleware;
