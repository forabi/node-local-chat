import React, { PropTypes } from 'react';
import styles from './style.css';

const Warning = props => (
  <div className={styles.root}>
    {props.icon ?
      <props.icon className={styles.icon} />
    : null}
    <div className={styles.text}>
      {props.children}
    </div>
  </div>
);

Warning.propTypes = {
  children: PropTypes.oneOf([PropTypes.element, PropTypes.string]).isRequired,
  icon: PropTypes.element,
};

export default Warning;
