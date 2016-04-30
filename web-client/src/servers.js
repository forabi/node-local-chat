import { differenceBy } from 'lodash';

const reducer = (previousState = [], { type, payload } = { }) => {
  switch (type) {
    case 'SERVER_UP':
      return [previousState, ...payload];
    case 'SERVER_DOWN':
      return differenceBy(previousState, [{ id: payload }], 'id');
    case 'SET_SERVERS':
      return payload;
    default:
      return previousState;
  }
};

export default reducer;
