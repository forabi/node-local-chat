const reducer = (previousState = null, { type, payload }) => {
  switch (type) {
    case 'SET_CLIENT_ID':
      return payload;
    default:
      return previousState;
  }
};

export default reducer;
