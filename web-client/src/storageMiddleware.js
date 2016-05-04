import localforage from 'localforage';

const storage = localforage.createInstance({
  driver: localforage.INDEXEDDB,
  name: 'local-chat-messages',
  version: 1,
});

const storageMiddleware = () => next => async ({ type, payload }) => {
  let message;
  switch (type) {
    case 'INCOMING_MESSAGE':
      await storage.setItem(payload.id, payload);
      break;
    case 'OUTGOING_MESSAGE':
      await storage.setItem(payload.id, payload);
      break;
    case 'UPDATE_MESSAGE':
      message = await storage.getItem(payload.id);
      await storage.setItem(payload.id, { ...message, ...payload });
      break;
    default: // Do nothing
  }
  return next({ type, payload });
};

export default storageMiddleware;
