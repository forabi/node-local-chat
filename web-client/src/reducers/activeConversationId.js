import { handleActions } from 'redux-actions';
import actions from '../../../actions';

const initialState = null;

const reducer = handleActions({
  [actions.SET_ACTIVE_CONVERSATION]: (_, { payload: newId }) => newId,
}, initialState);

export default reducer;
