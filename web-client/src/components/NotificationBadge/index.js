import React, { PropTypes } from 'react';
import style from './style.css';

const NotificationBadge = ({ count }) => (
  <span className={style.root}>{count}</span>
);

NotificationBadge.propTypes = {
  count: PropTypes.number.isRequired,
};

export default NotificationBadge;
