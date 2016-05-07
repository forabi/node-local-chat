import uuid from 'node-uuid';
import { createAction } from 'redux-actions';
import actions from '../../actions';

export const setActiveConversation = createAction(actions.SET_ACTIVE_CONVERSATION);

export const sendMessage = createAction(
  actions.OUTGOING_MESSAGE,
  message => (
    { ...message, id: uuid.v4(), dateSent: (new Date).toJSON() }
  )
);

export const markMessageAsRead = createAction(
  actions.UPDATE_MESSAGE,
  ({ id, from }) => ({ id, from, status: 'read' })
);

export const fetchMessages = createAction(actions.FETCH_MESSAGES);

export const setDisplayName = createAction(actions.SET_DISPLAY_NAME);

export const connectToServer = createAction(actions.SET_SERVER_ADDRESS);

export const requestNewServer = createAction(actions.CREATE_NEW_SERVER);

export const setUserData = createAction(actions.UPDATE_USER_PROFILE);
