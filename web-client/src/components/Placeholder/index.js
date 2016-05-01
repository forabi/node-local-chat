import React, { PropTypes } from 'react';
import styles from './style.css';

const Placeholder = (props) => (
  <div className={styles.root}>
    {<props.icon className={styles.icon} />}
    <span className={styles.text}>
      <h2 className={styles.title}>
        {props.title}
      </h2>
      {props.children}
    </span>
    <span className={styles.action}>
      {props.actions}
    </span>
  </div>
);

Placeholder.propTypes = {
  title: PropTypes.string,
  children: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  actions: PropTypes.oneOf(PropTypes.element, PropTypes.arrayOf(PropTypes.element)),
};

export default Placeholder;
