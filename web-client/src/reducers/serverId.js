import { handleActions } from 'redux-actions';
import actions from '../../../actions';

const initialState = null;

const reducer = handleActions({
  [actions.SET_SERVER_ADDRESS]: (_, { payload }) => payload,
  [actions.SERVER_DOWN]: (previousState, { payload: serverId }) => {
    if (serverId === previousState) {
      return null;
    }
    return previousState;
  },
}, initialState);

export default reducer;
