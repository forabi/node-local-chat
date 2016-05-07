import { pick, includes } from 'lodash';
import actions from '../../../actions';
// @TODO: end-to-end encryption
const encrypt = async content => content;
const decrypt = async content => content;

const encryptable = [
  actions.OUTGOING_MESSAGE,
  actions.OUTGOING_MESSAGE_UPDATE,
];

const decryptable = [
  actions.INCOMING_MESSAGE,
  actions.INCOMING_MESSAGE_UPDATE,
];

const encryptionMiddleware = () => next => async ({ type, payload }) => {
  if (includes(decryptable, type)) {
    return next({
      type,
      payload: {
        ...pick(payload, 'from', 'conversationId'),
        ...await decrypt(payload.content),
      },
    });
  } else if (includes(encryptable, type)) {
    return next({
      type,
      payload: {
        ...pick(payload, 'to', 'conversationId'),
        content: await encrypt(payload),
      },
    });
  }
  return next({ type, payload });
};

export default encryptionMiddleware;
