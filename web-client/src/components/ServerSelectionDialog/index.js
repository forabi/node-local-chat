import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { connectToServer, requestNewServer } from '../../actions';
import Placeholder from '../Placeholder';
import ComputerIcon from './computer.svg';
import styles from './style.css';

const serverShape = PropTypes.shape({
  addresses: PropTypes.arrayOf(PropTypes.string.isRequired),
  port: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  fqdn: PropTypes.string.isRequired,
  numClients: PropTypes.number.isRequired,
  txt: PropTypes.shape({
    address: PropTypes.string.isRequired,
    port: PropTypes.string.isRequired,
    localhost: PropTypes.string.isRequired,
  }).isRequired,
});

const ServerSelectionDialog = ({ servers, open, dispatch }) => (
  <Dialog
    className={styles.root}
    title="Select chat server"
    modal open={open}
  >
    <div className={styles.content}>
      {servers.length === 0 ?
        <Placeholder
          title="No local chat servers online"
          icon={ComputerIcon}
          actions={
            <RaisedButton
              primary label="Start a new chat server"
              onClick={() => dispatch(requestNewServer('potato'))}
            />
          }
        >
          You can create a server on this computer and chat with others on the local network
        </Placeholder> :
        <List
          className={styles.list}
        >{
          servers.map(server =>
            <ListItem
              key={server.fqdn}
              primaryText={server.name}
              secondaryText={server.txt.address}
              onClick={() => (
                dispatch(connectToServer(`${server.txt.address || 'localhost'}:${server.txt.port}`))
              )}
            />
          )
        }</List>
      }
    </div>
  </Dialog>
);

ServerSelectionDialog.propTypes = {
  servers: PropTypes.arrayOf(serverShape),
  open: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(({ servers }) => ({ servers }))(ServerSelectionDialog);
