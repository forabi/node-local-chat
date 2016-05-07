import { handleActions } from 'redux-actions';
import { analytics } from '../utils/storage';
import actions from '../../../actions';

const initialState = 0;

const reducer = handleActions({
  [actions.RECORD_USER_VISIT]: async n => {
    await analytics.setItem('numVisits', n + 1);
    return n + 1;
  },
}, initialState);

export default reducer;
