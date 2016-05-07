import { createSelector } from 'reselect';

const getMessages = state => state.messages;
const getActiveConversationId = state => state.activeConversationId;

const initialState = [];

export const getActiveConversationMessages = createSelector(
  [getMessages, getActiveConversationId],
  (messages, activeConversationId) => (messages ? messages[activeConversationId] : initialState)
);

export default getActiveConversationMessages;
