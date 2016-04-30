import React, { PropTypes } from 'react';
import style from './style.css';

const NotificationBadge = ({ children: count }) => (
  <span className={style.root}>{count}</span>
);

NotificationBadge.propTypes = {
  children: PropTypes.number.isRequired,
};

export default NotificationBadge;
