const initalState = [];

const reducer = (previousState = initalState, { type, payload }) => {
  switch (type) {
    case 'INCOMING_MESSAGE':
    case 'OUTGOING_MESSAGE':
      return [
        ...previousState,
        payload,
      ];
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
