import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import styles from './style.css';

const Wizard = () => {
  const screens = [
    <div>Screen 1</div>,
    <div>Screen 2</div>,
  ];

  const actions = [
    <FlatButton
      label="Next"
      primary
    />,
  ];

  return (
    <Dialog
      className={styles.root}
      open modal
      actions={actions}
    >
      {screens[0]}
    </Dialog>
  );
};

export default Wizard;
