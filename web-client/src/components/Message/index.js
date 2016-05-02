import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import PureComponent from 'react-pure-render/component';
import moment from 'moment';
import style from './style.css';
import PendingIcon from 'material-ui/svg-icons/action/schedule';
import SentIcon from 'material-ui/svg-icons/action/done';
import DeliveredIcon from 'material-ui/svg-icons/action/done-all';
// import RelativeDate from '../RelativeDate';

const iconProps = { size: 16, style: { height: 16, width: 16, opacity: 1, color: 'gray' } };

const getIcon = (status) => {
  if (status === 'pending') {
    return <PendingIcon {...iconProps} />;
  } else if (status === 'sent') {
    return <SentIcon {...iconProps} />;
  } else if (status === 'delivered') {
    return <DeliveredIcon { ...iconProps } />;
  } else if (status === 'read') {
    return <DeliveredIcon { ...iconProps } color="#4FC3F7" />;
  }
  return null;
};

class Message extends PureComponent {
  static propTypes = {
    outgoing: PropTypes.bool,
    incoming: PropTypes.bool,
    text: PropTypes.string.isRequired,
    dateSent: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    direction: PropTypes.oneOf(['right', 'left', 'none']).isRequired,
    status: PropTypes.oneOf(['pending', 'sent', 'delivered', 'unread']).isRequired,
    style: PropTypes.object,
    onVisible: PropTypes.func,
  };

  componentDidMount() {
    if (this.props.onVisible && window.IntersectionObserver) {
      this.observer = new window.IntersectionObserver(changes => {
        changes.forEach(change => {
          console.log('IntersectionObserver called');
          this.props.onVisible();
          this.observer.unobserve(change.target);
        });
      }, {
        threshold: [1],
      });
      this.observer.observe(findDOMNode(this));
    }
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect();
  }

  render() {
    const { outgoing, text, status, dateSent, direction, style: inlineStyle } = this.props;
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
  }
}

export default Message;
