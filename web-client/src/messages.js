import map from 'lodash/map';
import slice from 'lodash/slice';
import findIndex from 'lodash/findIndex';

const initalState = [];

const reducer = (previousState = initalState, { type, payload } = { }) => {
  let index;
  switch (type) {
    case 'INCOMING_MESSAGE':
      return [
        ...previousState,
        { ...payload, status: 'pending', incoming: true },
      ];
    case 'OUTGOING_MESSAGE':
      return [
        ...previousState,
        { ...payload, status: 'pending', outgoing: true },
      ];
    case 'UPDATE_MESSAGE':
      index = findIndex(previousState, { id: payload.id });
      return [
        ...slice(previousState, 0, index),
        { ...previousState[index], ...payload },
        ...slice(previousState, index + 1),
      ];
    case 'SET_ACTIVE_CONVERSATION':
      return map(previousState, message => {
        if (message.from === payload) {
          return { ...message, status: 'read' };
        }
        return message;
      });
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
import filter from 'lodash/filter';

const getMessages = state => state.messages;
const getActiveConversationId = state => state.activeConversationId;

export const getActiveConversationMessages = createSelector(
  [getMessages, getActiveConversationId],
  (messages, activeConversationId) => (
    filter(messages, m => (m.to === activeConversationId || m.from === activeConversationId))
  )
);

export default reducer;
