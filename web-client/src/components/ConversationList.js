import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import { connect } from 'react-redux';
import { setActiveConversation } from '../actions';

const styles = {
  conversation: {
    border: '1px solid black',
  },
  activeConversation: {
    background: 'lightblue',
  },
};

export const conversationIdShape = PropTypes.string;
export const converstionShape = PropTypes.shape({
  unreadCount: PropTypes.number,
  displayName: PropTypes.string,
  id: conversationIdShape.isRequired,
});

export class ConversationList extends PureComponent {
  static propTypes = {
    activeConversationId: PropTypes.oneOf([conversationIdShape, null]).isRequired,
    conversations: PropTypes.arrayOf(conversationIdShape),
  };

  render() {
    const { conversations, activeConversationId, dispatch } = this.props;
    if (!conversations.length) return <span>No clients online</span>;
    return (<ul>
      {
        conversations.map(conversation => {
          let style = styles.conversation;
          if (conversation.id === activeConversationId) {
            style = { ...style, ...styles.activeConversation };
          }
          return (
            <li
              key={conversation.id} style={style}
              onClick={ () => dispatch(setActiveConversation(conversation.id)) }
            >
              {conversation.displayName}
              {conversation.unreadCount > 0 && ` (${conversation.unreadCount})`}
            </li>
          );
        })
      }
    </ul>);
  }
}

export default connect()(ConversationList);
