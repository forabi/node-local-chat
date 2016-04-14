import React from 'react';
import PureComponent from 'react-pure-render/component';
import ConversationList from './ConversationList';
import ChatView from './ChatView';
import { connect } from 'react-redux';
import { getConversations } from '../conversations';
import { getActiveConversationMessages } from '../messages';
import toArray from 'lodash/toArray';

class App extends PureComponent {
  render() {
    const {
      conversations,
      activeConversationId,
      activeConversationMessages,
      activeConversationDraft,
    } = this.props;

    return (<span>
      <ConversationList
        activeConversationId={activeConversationId}
        conversations={toArray(conversations)}
      />
      {Boolean(activeConversationId !== null) && <ChatView
        conversationId={activeConversationId}
        messages={activeConversationMessages}
        info={conversations[activeConversationId]}
        draft={activeConversationDraft}
      />}
    </span>);
  }
}

export default connect(state => ({
  conversations: getConversations(state),
  activeConversationId: state.activeConversationId,
  activeConversationMessages: getActiveConversationMessages(state),
  activeConversationDraft: state.drafts[state.activeConversationId] || '',
}))(App);
