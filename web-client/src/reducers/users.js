import { handleActions } from 'redux-actions';
import actions from '../../../actions';

const initialState = { };

const reducer = handleActions({
  [actions.SET_USERS]: (_, { payload: users }) => users,
  [actions.UPDATE_USER]: (users, { payload: user }) => ({
    ...users,
    [user.id]: { ...users[user.id], ...user },
  }),
  [actions.ADD_USER]: (users, { payload: user }) => ({ ...users, [user.id]: user }),
}, initialState);

export default reducer;
