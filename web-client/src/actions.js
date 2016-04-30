import uuid from 'node-uuid';

export const setActiveConversation = payload => ({
  type: 'SET_ACTIVE_CONVERSATION',
  payload,
});

export const sendMessageTo = (to, message) => ({
  type: 'OUTGOING_MESSAGE',
  payload: { to, ...message, id: uuid.v4(), dateSent: new Date },
});

export const markMessageAsRead = ({ id, from }) => ({
  type: 'UPDATE_MESSAGE',
  payload: { id, from, status: 'read' },
});

export const setDisplayName = name => ({
  type: 'SET_DISPLAY_NAME',
  payload: name,
});

export const connectToServer = address => ({
  type: 'SET_SERVER_ADDRESS',
  payload: address,
});
