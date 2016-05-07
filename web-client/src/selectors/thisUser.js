import { createSelector } from 'reselect';

const getUserId = state => state.userId;
const getUsers = state => state.users;

export const getThisUser = createSelector(
  [getUserId, getUsers],
  (userId, users) => users[userId]
);

export default getThisUser;
