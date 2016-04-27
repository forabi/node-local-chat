import React, { PropTypes } from 'react';
import RelativeDate from '../RelativeDate';
import style from './style.css';

const Message = ({ text, date, direction, style: inlineStyle }) => {
  let className;
  if (direction === 'right') {
    className = style.bubble__right;
  } else if (direction === 'left') {
    className = style.bubble__left;
  } else {
    className = style.message_event;
  }
  return (
    <div
      style={inlineStyle}
      className={className}
    >
      {text}
      <small className={style.date}>
          <RelativeDate>{date}</RelativeDate>
      </small>
    </div>
  );
};

Message.propTypes = {
  text: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  direction: PropTypes.oneOf(['right', 'left']).isRequired,
  style: PropTypes.object,
};

export default Message;
