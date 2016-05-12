import Dexie from 'dexie';

const db = new Dexie('localchat');

db.version(1).stores({
  users: '&id, displayName, online, lastSeen, image',
  messages: '&id, type, text, content, from, to, conversationId, dateSent, dateReceived',
  tokens: '&serverId, token',
  analytics: '&type, value',
  userdata: '&id, value',
});

const { users, messages, userdata, tokens, analytics } = db;

export { users, messages, userdata, tokens, analytics };
export default db;

db.open();
