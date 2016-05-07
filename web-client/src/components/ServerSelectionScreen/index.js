import React, { PropTypes } from 'react';
import { isEmpty, toArray } from 'lodash';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import { connect } from 'react-redux';
import { connectToServer, requestNewServer } from '../../actionCreators';
import Placeholder from '../Placeholder';
import ComputerIcon from './computer.svg';
import styles from './style.css';

const serverShape = PropTypes.shape({
  addresses: PropTypes.arrayOf(PropTypes.string.isRequired),
  port: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  fqdn: PropTypes.string.isRequired,
  txt: PropTypes.shape({
    address: PropTypes.string.isRequired,
    port: PropTypes.string.isRequired,
    localhost: PropTypes.string.isRequired,
  }).isRequired,
});

const ServerSelectionScreen = ({ servers, dispatch }) => (
  <div className={styles.root}>
    {isEmpty(servers) ?
      <Placeholder
        title="No local chat servers are online"
        icon={ComputerIcon}
        actions={
          <RaisedButton
            primary label="Start a new chat server"
            onClick={() => dispatch(requestNewServer({ name: 'potato' }))}
          />
        }
      >
        <span>
          <LinearProgress mode="indeterminate" />
          <br />
          <p>We'll keep looking...</p>
          <p>Alternatively, you can create a server on this computer and
          chat with others on the local network.</p>
        </span>
      </Placeholder> :
      <List
        className={styles.list}
      >{
        servers.map(server =>
          <ListItem
            key={server.fqdn}
            primaryText={server.name}
            secondaryText={server.txt.address}
            onClick={() => {
              const address = `${server.txt.hostname || 'localhost'}:${server.txt.port}`;
              dispatch(connectToServer(address));
            }}
          />
        )
      }</List>
    }
  </div>
);

ServerSelectionScreen.propTypes = {
  servers: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
};

export default connect(({ servers }) => ({ servers: toArray(servers) }))(ServerSelectionScreen);
