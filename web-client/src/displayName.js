const reducer = (previousState = '(unknown)', { type, payload }) => {
  switch (type) {
    case 'SET_DISPLAY_NAME':
      return payload;
    default:
      return previousState;
  }
};

export default reducer;
