import React, { PropTypes } from 'react';
// import RelativeDate from '../RelativeDate';
import moment from 'moment';
import style from './style.css';
import PendingIcon from 'material-ui/svg-icons/action/schedule';
import SentIcon from 'material-ui/svg-icons/action/done';
import DeliveredIcon from 'material-ui/svg-icons/action/done-all';

const iconProps = { size: 16, style: { height: 14, width: 14, opacity: 0.5, color: 'gray' } };

const getIcon = (status) => {
  if (status === 'pending') {
    return <PendingIcon {...iconProps} />;
  } else if (status === 'sent') {
    return <SentIcon {...iconProps} />;
  } else if (status === 'delivered') {
    return <DeliveredIcon { ...iconProps } />;
  } else if (status === 'read') {
    return <DeliveredIcon { ...iconProps } color="blue" />;
  }
  return null;
};

const Message = ({ outgoing, text, status, dateSent, direction, style: inlineStyle }) => {
  let className;
  if (direction === 'right') {
    className = style.bubble__right;
  } else if (direction === 'left') {
    className = style.bubble__left;
  } else {
    className = style.message__event;
  }
  return (
    <div
      style={inlineStyle}
      className={className}
    >
      {text}
      <span className={style.metadata_container}>
        <span className={style.date}>{
          moment(dateSent).format('LT')
        }</span>
        {outgoing ? getIcon(status) : null}
      </span>
    </div>
  );
};

Message.propTypes = {
  outgoing: PropTypes.bool,
  incoming: PropTypes.bool,
  text: PropTypes.string.isRequired,
  dateSent: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  direction: PropTypes.oneOf(['right', 'left', 'none']).isRequired,
  status: PropTypes.oneOf(['pending', 'sent', 'delivered', 'unread']).isRequired,
  style: PropTypes.object,
};

export default Message;
