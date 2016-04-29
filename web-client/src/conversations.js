import { createSelector } from 'reselect';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import filter from 'lodash/filter';
import mapValues from 'lodash/mapValues';

let conversations = { };

const getClients = state => state.clients;
const getClientId = state => state.clientId;
const getMessages = state => state.messages;

export const getConversations = createSelector(
  [getClients, getClientId, getMessages],
  (clients, clientId, messages) => {
    conversations = mapValues({
      ...mapValues(conversations, c => ({ ...c, online: false })),
      ...keyBy(map(filter(clients, ({ id }) => id !== clientId), c => ({ ...c, online: true })), 'id'),
    },
      c => ({
        ...c,
        unreadCount: filter(messages, m => m.from === c.id && m.status !== 'read').length,
      })
    );
    return conversations;
  }
);
