import React, { PropTypes } from 'react';
import RelativeDate from '../RelativeDate';
import style from './style.css';

const Message = ({ text, date, direction, style: inlineStyle }) => (
  <div
    style={inlineStyle}
    className={direction === 'right' ? style.bubble__right : style.bubble__left }
  >
    {text}
    <small className={style.date}><RelativeDate>{date}</RelativeDate></small>
  </div>
);

Message.propTypes = {
  text: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  direction: PropTypes.oneOf(['right', 'left']).isRequired,
  style: PropTypes.object,
};

export default Message;
