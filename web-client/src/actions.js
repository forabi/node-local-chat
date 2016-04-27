export const setActiveConversation = payload => ({
  type: 'SET_ACTIVE_CONVERSATION',
  payload,
});

export const sendMessageTo = (to, message) => ({
  type: 'OUTGOING_MESSAGE',
  payload: { to, ...message, dateSent: new Date },
});

export const markMessageAsSeen = messageId => ({
  type: 'MARK_MESSAGE_SEEN',
  payload: messageId,
});

export const setDisplayName = name => ({
  type: 'SET_DISPLAY_NAME',
  payload: name,
});
