import { handleActions } from 'redux-actions';
import actions from '../../../actions';

const initialState = { };

const reducer = handleActions({
  [actions.SET_USER_ID]: (_, { payload: userId }) => userId,
  [actions.CREATE_USER]: {
    next: (_, { payload: user }) => user.id,
    throw: () => null, // @TODO
  },
}, initialState);

export default reducer;
