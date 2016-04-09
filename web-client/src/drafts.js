const initalState = { };

const reducer = (previousState = initalState, { type, payload }) => {
  switch (type) {
    case 'SET_DRAFT':
      return {
        ...previousState,
        [payload.conversationId]: payload.text,
      };
    case 'OUTGOING_MESSAGE':
      return {
        ...previousState,
        [payload.conversationId]: '',
      };
    default:
      return previousState;
  }
};

export default reducer;
