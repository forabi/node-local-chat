import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PureComponent from 'react-pure-render/component';
import { setActiveConversation } from '../../actions';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import OnlineIcon from '../OnlineIcon';
import style from './style.css';
import { messageShape } from '../propTypes';
import NotificationBadge from '../NotificationBadge';

export const conversationIdShape = PropTypes.string;
export const converstionShape = PropTypes.shape({
  unreadCount: PropTypes.number,
  displayName: PropTypes.string,
  id: conversationIdShape.isRequired,
});

export class ConversationList extends PureComponent {
  static propTypes = {
    activeConversationId: conversationIdShape,
    conversations: PropTypes.arrayOf(messageShape),
  };

  render() {
    const { conversations, activeConversationId, dispatch } = this.props;

    return (<div className={this.props.className}>
      {!conversations.length ? <span>No clients online</span> :
        <List className={style.list}>{
          conversations.map(conversation => {
            let className = style.list_item__active;
            if (conversation.id !== activeConversationId) {
              className = style.list_item;
            }
            return (
              <ListItem
                className={className}
                key={conversation.id} style={style}
                leftAvatar={<Avatar>{conversation.displayName.substring(0, 1)}</Avatar>}
                rightIcon={
                  conversation.unreadCount === 0 ? null :
                    <NotificationBadge>{conversation.unreadCount}</NotificationBadge>
                }
                onClick={() => dispatch(setActiveConversation(conversation.id))}
              >
                {conversation.displayName}
                <OnlineIcon isOnline={conversation.online} />
              </ListItem>
            );
          })
        }</List>}
    </div>);
  }
}

export default connect()(ConversationList);
