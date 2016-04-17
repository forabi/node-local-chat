import React from 'react';
import PureComponent from 'react-pure-render/component';
import ConversationList from '../ConversationList';
import ChatView from '../ChatView';
import { connect } from 'react-redux';
import { getConversations } from '../../conversations';
import { getActiveConversationMessages } from '../../messages';
import toArray from 'lodash/toArray';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';
import Avatar from 'material-ui/Avatar';
import style from './style.css';

const muiTheme = getMuiTheme();

class App extends PureComponent {
  render() {
    const {
      conversations,
      activeConversationId,
      activeConversationMessages,
      displayName,
    } = this.props;

    return (<MuiThemeProvider muiTheme={muiTheme}>
      <div className={style.app}>
        <Toolbar className={style.header}>
          <Avatar className={style.headerAvatar}>S</Avatar>
          <ToolbarSeparator style={{ margin: '0 24px', top: 0 }} />
          <span>{displayName}</span>
        </Toolbar>
        <ConversationList className={style.conversationList}
          activeConversationId={activeConversationId}
          conversations={toArray(conversations)}
        />
        <ChatView className={style.chatView}
          conversationId={activeConversationId}
          messages={activeConversationMessages}
          info={conversations[activeConversationId]}
        />
      </div>
    </MuiThemeProvider>);
  }
}

export default connect(state => ({
  displayName: state.displayName,
  conversations: getConversations(state),
  activeConversationId: state.activeConversationId,
  activeConversationMessages: getActiveConversationMessages(state),
}))(App);
