import { handleActions } from 'redux-actions';
import { messages as storage } from '../utils/storage';
import actions from '../../../actions';
import { slice, findIndex } from 'lodash';
import autodir from '../utils/autodir';

const reducer = handleActions({
  [actions.FETCH_MESSAGES]: () => (
    storage.orderBy('dateReceived').desc().limit(1000).toArray(),
  ),
  [actions.INCOMING_MESSAGE]: (messages, { payload }) => (
    [
      ...messages,
      { ...payload,
        incoming: true,
        textDirection: autodir(payload.text),
      },
    ]
  ),
  [actions.OUTGOING_MESSAGE]: (messages, { payload }) => (
    [
      ...messages,
      { ...payload,
        status: 'pending',
        outgoing: true,
        textDirection: autodir(payload.text),
      },
    ]
  ),
  [actions.UPDATE_MESSAGE]: (messages, { payload }) => {
    const index = findIndex(messages, { id: payload.id });
    if (index === -1) {
      return messages;
    }
    return [
      ...slice(messages, 0, index),
      { ...messages[index], ...payload },
      ...slice(messages, index + 1),
    ];
  },
  [actions.USER_OFFLINE]: (messages, { payload }) => (
    [
      ...messages,
      {
        from: payload,
        type: 'event',
        id: 'offline',
        text: 'User went offline. You can no longer send messages.',
      },
    ]
  ),
}, []);

export default reducer;
