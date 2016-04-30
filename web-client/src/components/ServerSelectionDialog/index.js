import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import { connect } from 'react-redux';
import { connectToServer } from '../../actions';

const serverShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  addresses: PropTypes.arrayOf([PropTypes.string.isRequired]),
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
  <div>
    <Dialog
      title="Select chat server"
      modal open={open}
    >
      <List subheader="Online chat servers">{
        servers.map(server =>
          <ListItem
            key={server.fqdn}
            primaryText={server.name}
            onClick={() => (
              dispatch(connectToServer(`${server.txt.address || 'localhost'}:${server.txt.port}`))
            )}
          />
        )
      }</List>
    </Dialog>
  </div>
);

ServerSelectionDialog.propTypes = {
  servers: PropTypes.arrayOf(serverShape),
  open: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(({ servers }) => ({ servers }))(ServerSelectionDialog);
