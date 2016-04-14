import filter from 'lodash/filter';

const reducer = (previousState = [], { type, payload }) => {
  switch (type) {
    case 'CLIENTS_UPDATED':
      return payload;
    default:
      return previousState;
  }
};

export default reducer;
