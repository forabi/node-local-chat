import React, { PropTypes } from 'react';
import style from './style.css';
import moment from 'moment';

const Message = ({ text, date }) => (
  <div className={style.bubble}>
    {text}
    <small className={style.date}>{moment(date).fromNow(true)}</small>
  </div>
);

Message.propTypes = {
  text: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
};

export default Message;
