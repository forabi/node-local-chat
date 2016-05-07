import actions from '../actions';

const actionHandlers = { };

const handleSocketAction = (socket, action) => actionHandlers[action.type].call(socket, action);

actionHandlers[actions.OUTGOING_MESSAGE] = ({ payload }) => {
  this.emit('action', {
    type: actions.INCOMING_MESSAGE_UPDATE,
    payload: {
      id: payload.id,
      status: 'sent',
      dateSent: new Date,
    },
  });

  this.broadcast.to(payload.to)
  .emit('action', {
    type: actions.INCOMING_MESSAGE,
    payload: {
      ...payload,
      from: this.id,
      status: 'delivered',
      dateReceived: new Date,
    },
  });
  return;
};

actionHandlers[actions.OUTGOING_MESSAGE_UPDATE] = ({ payload }) => {
  this.broadcast.to(payload.from)
  .emit('action', {
    type: actions.INCOMING_MESSAGE_UPDATE,
    payload: {
      id: payload.id,
      status: payload.status,
    },
  });
  return;
};



export default handleSocketAction;
