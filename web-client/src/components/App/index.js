import React from 'react';
import PureComponent from 'react-pure-render/component';
import ConversationList from '../ConversationList';
import ChatView from '../ChatView';
import { connect } from 'react-redux';
import { getConversations } from '../../conversations';
import { getActiveConversationMessages } from '../../messages';
import { toArray } from 'lodash';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';
import Avatar from 'material-ui/Avatar';
import style from './style.css';
import ServerSelectionDialog from '../ServerSelectionDialog';

const muiTheme = getMuiTheme();

class App extends PureComponent {
  render() {
    const {
      conversations,
      activeConversationId,
      activeConversationMessages,
      displayName,
      serverAddress,
    } = this.props;

    return (<MuiThemeProvider muiTheme={muiTheme}>{
      serverAddress === null ?
        <ServerSelectionDialog open /> :
        <div className={style.app}>
          <Toolbar className={style.header}>
            <Avatar className={style.headerAvatar}>S</Avatar>
            <ToolbarSeparator style={{ margin: '0 24px', top: 0 }} />
            <span>{displayName}</span>
          </Toolbar>
          <ConversationList
            className={style.conversation_list}
            activeConversationId={activeConversationId}
            conversations={toArray(conversations)}
          />
          <ChatView
            className={style.chat_view}
            clientsAvailable={conversations.length}
            conversationId={activeConversationId}
            messages={activeConversationMessages}
            info={conversations[activeConversationId]}
          />
        </div>
    }</MuiThemeProvider>);
  }
}

export default connect(state => ({
  displayName: state.displayName,
  conversations: getConversations(state),
  activeConversationId: state.activeConversationId,
  activeConversationMessages: getActiveConversationMessages(state),
  serverAddress: state.serverAddress,
}))(App);
