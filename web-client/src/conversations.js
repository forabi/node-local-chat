import { createSelector } from 'reselect';
import filter from 'lodash/filter';
import mapValues from 'lodash/mapValues';
import _ from 'lodash';

let conversations = { };

const getClients = state => state.clients;
const getClientId = state => state.clientId;
const getMessages = state => state.messages;

export const getConversations = createSelector(
  [getClients, getClientId, getMessages],
  (clients, clientId, messages) => {
    conversations = mapValues({
      ...mapValues(conversations, c => ({ ...c, online: false })),
      ...(
        _.chain(clients)
        .filter(({ id }) => id !== clientId)
        .map(c => ({ ...c, online: true }))
        .keyBy('id')
      ).value(),
    },
      c => ({
        ...c,
        unreadCount: filter(messages, m => m.from === c.id && m.status !== 'read').length,
      })
    );
    return conversations;
  }
);
