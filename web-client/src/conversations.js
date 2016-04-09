const initalState = { };

const reducer = (previousState = initalState, { type, payload }) => {
  switch (type) {
    case 'INCOMING_MESSAGE':
    case 'OUTGOING_MESSAGE':
      const convId = type === 'OUTGOING_MESSAGE' ? payload.to : payload.from;
      return {
        ...previousState,
        [convId]: [...(previousState[convId] || []), payload],
      };
    default:
      return previousState;
  }
};

export default reducer;
