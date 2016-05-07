import { pick } from 'lodash';
import actions from '../../../actions';

const messageStatusMiddleware = ({ dispatch }) => next => async ({ type, payload }) => {
  if (type === actions.INCOMING_MESSAGE) {
    const update = {
      status: 'delivered',
    };

    dispatch({
      type: actions.OUTGOING_MESSAGE_UPDATE,
      payload: {
        ...pick(payload, 'id', 'conversationId'),
        ...update,
      },
    });

    return next({ type, payload: { ...payload, ...update } });
  }
  return next({ type, payload });
};

export default messageStatusMiddleware;
