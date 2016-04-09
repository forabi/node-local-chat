const reducer = (previousState = [], action) => {
  return action.payload || previousState;
};

export default reducer;
