import React from 'react';
import { connect } from 'react-redux';
import { setActiveConversation } from '../actions';

const styles = {
  client: {
    border: '1px solid black',
  },
  activeClient: {
    background: 'lightblue',
  },
};

export class ClientList extends React.Component {
  render() {
    const { clients, activeClientId, dispatch } = this.props;
    if (!clients.length) return <span>No clients online</span>;
    return (<ul>
      {
        clients.map(client => {
          let style = styles.client;
          if (client.name === activeClientId) {
            style = { ...style, ...styles.activeClient };
          }
          return (
            <li
              key={client.name} style={style}
              onClick={ () => dispatch(setActiveConversation(client.name)) }
            >
              {client.name}
            </li>
          );
        })
      }
    </ul>);
  }
}

export default connect()(ClientList);
