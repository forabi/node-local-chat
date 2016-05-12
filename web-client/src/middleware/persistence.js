import { userdata, tokens, messages, analytics } from '../utils/storage';
import { toArray, mapValues } from 'lodash';
import actions from '../../../actions';

const storageMiddleware = store => next => async ({ type, payload }) => {
  if (type === actions.RECORD_USER_VISIT) {
    await analytics.setItem('numVisits', payload);
  } else if (type === actions.SET_TOKEN) {
    const serverId = store.getState().serverId;
    await tokens.put({ serverId, token: payload });
  } else if (type === actions.INCOMING_MESSAGE || type === actions.OUTGOING_MESSAGE) {
    await messages.put(payload);
  } else if (type === actions.INCOMING_MESSAGE_UPDATE || type === actions.OUTGOING_MESSAGE_UPDATE) {
    await messages.update(payload.id, payload);
  } else if (type === actions.UPDATE_USER_PROFILE) {
    await userdata.bulkPut(
      toArray(
        mapValues(payload, (value, key) => ({ id: key, value }))
      )
    );
  }
  return next({ type, payload });
};

export default storageMiddleware;
