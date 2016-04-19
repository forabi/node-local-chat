import pullAllBy from 'lodash/pullAllBy';

const reducer = (previousState = [], { type, payload }) => {
  switch (type) {
    case 'CLIENTS_UPDATED':
      return payload;
    case 'CLIENT_OFFLINE':
      return pullAllBy(previousState, { id: payload }, 'id');
    case 'CLIENT_ONLINE':
      return map(previousState, client => {
        if (client.id === payload) {
          return { ...client, online: true };
        }
        return client;
      });
    case 'NEW_CLIENT':
      return [...previousState, { ...payload, online: true }];
    default:
      return previousState;
  }
};

export default reducer;
