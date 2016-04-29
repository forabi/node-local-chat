import { PropTypes } from 'react';

export const messageShape = PropTypes.shape({
  type: PropTypes.oneOf(['text', 'event', 'image', 'video', 'url', 'contact']).isRequired,
  from: PropTypes.string,
  to: PropTypes.string,
  text: PropTypes.string,
  dateSent: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  dateReceived: PropTypes.string,
  status: PropTypes.oneOf(['pending', 'sent', 'delivered', 'unread']).isRequired,
});
