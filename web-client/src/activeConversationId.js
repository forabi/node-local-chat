const initalState = null;

const reducer = (previousState = initalState, { type, payload }) => {
  switch (type) {
    case 'SET_ACTIVE_CONVERSATION':
      return payload;
    default:
      return previousState;
  }
};

export default reducer;
