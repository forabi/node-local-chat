import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PureComponent from 'react-pure-render/component';
import { setActiveConversation } from '../../actions';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import OnlineIcon from '../OnlineIcon';
import style from './style.css';

const styles = {
  conversation: { },
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
export const conversationShape = PropTypes.shape({
  text: PropTypes.string.isRequired,
  read: PropTypes.bool.isRequired,
});

export class ConversationList extends PureComponent {
  static propTypes = {
    activeConversationId: conversationIdShape,
    conversations: PropTypes.arrayOf(conversationShape),
  };

  render() {
    const { conversations, displayName, activeConversationId, dispatch } = this.props;
    
    return (<div className={this.props.className}>
      {!conversations.length ? <span>No clients online</span> :
      <List className={style.list}>
        {
          conversations.map(conversation => {
            let className = className = 'activeListItem';
            console.log('compare', conversation.id === activeConversationId)
            if (conversation.id === activeConversationId) {
              className == 'activeListItem';
            }
            return (
              <ListItem className={style[className]}
                key={conversation.id} style={style}
                leftAvatar={<Avatar>{conversation.displayName.substring(0, 1)}</Avatar>}
                rightIcon={ <span>{conversation.unreadCount > 0 ? conversation.unreadCount : null}</span> }
                onClick={ () => dispatch(setActiveConversation(conversation.id)) }
              >
                {conversation.displayName}
                <OnlineIcon isOnline={conversation.online}/>
              </ListItem>
            );
          })
        }
      </List>}
    </div>);
  }
}

export default connect()(ConversationList);
