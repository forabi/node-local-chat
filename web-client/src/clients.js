import { pullAllBy } from 'lodash';

const reducer = (previousState = [], { type, payload } = { }) => {
  switch (type) {
    case 'CLIENTS_UPDATED':
      return payload;
    case 'CLIENT_OFFLINE':
      return pullAllBy(previousState, [{ id: payload }], 'id');
    case 'CLIENT_ONLINE':
    case 'NEW_CLIENT':
      return [...previousState, payload];
    default:
      return previousState;
  }
};

export default reducer;
