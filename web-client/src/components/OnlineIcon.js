import React, { PropTypes } from 'react';

const OnlineIcon = ({ isOnline }) => (
  <span style={{ margin: '0 3px', color: isOnline ? 'green' : 'gray' }}>●</span>
);

OnlineIcon.propTypes = {
  isOnline: PropTypes.bool,
};

export default OnlineIcon;
