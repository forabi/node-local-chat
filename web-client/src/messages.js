import { filter, slice, findIndex } from 'lodash';
import autodir from './autodir';
const initalState = [];

const reducer = (previousState = initalState, { type, payload } = { }) => {
  let index;
  switch (type) {
    case 'INCOMING_MESSAGE':
      return [
        ...previousState,
        { ...payload,
          incoming: true,
          textDirection: autodir(payload.text),
        },
      ];
    case 'OUTGOING_MESSAGE':
      return [
        ...previousState,
        { ...payload,
          status: 'pending',
          outgoing: true,
          textDirection: autodir(payload.text),
        },
      ];
    case 'UPDATE_MESSAGE':
      index = findIndex(previousState, { id: payload.id });
      return [
        ...slice(previousState, 0, index),
        { ...previousState[index], ...payload },
        ...slice(previousState, index + 1),
      ];
    case 'CLIENT_OFFLINE':
      return [...previousState, {
        from: payload,
        type: 'event',
        id: 'offline',
        text: 'Client went offline. You can no longer send messages.',
      }];
    default:
      return previousState;
  }
};

import { createSelector } from 'reselect';

const getMessages = state => state.messages;
const getActiveConversationId = state => state.activeConversationId;

export const getActiveConversationMessages = createSelector(
  [getMessages, getActiveConversationId],
  (messages, activeConversationId) => (
    filter(messages, m => (m.to === activeConversationId || m.from === activeConversationId))
  )
);

export default reducer;
