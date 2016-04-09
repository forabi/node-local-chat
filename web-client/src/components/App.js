import React from 'react';
import ClientList from './ClientList';
import ChatView from './ChatView';
import { connect } from 'react-redux';
import find from 'lodash/find';

class App extends React.Component {
  render() {
    const {
      clients,
      activeConversationId,
      activeConversationMessages,
      activeConversationDraft,
    } = this.props;
    
    console.log(clients, activeConversationId, find(clients, c => c.name === activeConversationId));

    return (<span>
      <ClientList
        activeClientId={activeConversationId}
        clients={clients}
      />
      {activeConversationId && <ChatView
        conversationId={activeConversationId}
        messages={activeConversationMessages}
        info={find(clients, c => c.name === activeConversationId)}
        draft={activeConversationDraft}
      />}
    </span>);
  }
}

export default connect(({ activeConversationId, conversations, clients, drafts }) => ({
  clients,
  activeConversationId,
  activeConversationMessages: conversations[activeConversationId],
  activeConversationDraft: drafts[activeConversationId] || '',
}))(App);
