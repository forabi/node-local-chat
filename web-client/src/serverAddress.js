const reducer = (previousState = null, { type, payload }) => {
  switch (type) {
    case 'SET_SERVER_ADDRESS':
      return payload;
    case 'SERVER_DOWN':
      if (payload.address === previousState) {
        return null;
      }
      return previousState;
    default:
      return previousState;
  }
};

export default reducer;
