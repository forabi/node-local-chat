import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import styles from './style.css';

const Wizard = ({ children }) => {
  return (
    <Dialog
      className={styles.root}
      open modal
    >
      {children}
    </Dialog>
  );
};

Wizard.propTypes = {
  children: PropTypes.element,
};

export default Wizard;
