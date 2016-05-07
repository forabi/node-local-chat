import { handleActions } from 'redux-actions';
import actions from '../../../actions';

const initialState = { };

const reducer = handleActions({
  [actions.SERVER_UP]: (servers, { payload: serverId }) => ({
    ...servers,
    [serverId]: {
      ...servers[serverId],
      up: true,
    },
  }),
  [actions.SERVER_DOWN]: (servers, { payload: serverId }) => ({
    ...servers,
    [serverId]: {
      ...servers[serverId],
      up: false,
    },
  }),
  [actions.SET_SERVERS]: (_, { payload: servers }) => servers,
}, initialState);

export default reducer;
