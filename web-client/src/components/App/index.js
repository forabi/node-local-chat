import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import ConversationList from '../ConversationList';
import ChatView from '../ChatView';
import { connect } from 'react-redux';
import { getActiveConversationMessages } from '../../selectors/activeConversation';
import { fetchMessages } from '../../actionCreators'; 
import { getThisUser } from '../../selectors/thisUser';
import { toArray } from 'lodash';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';
import Avatar from 'material-ui/Avatar';
import style from './style.css';
import Dialog from 'material-ui/Dialog';
import ServerSelectionScreen from '../ServerSelectionScreen';
import ProfileSetupScreen from '../ProfileSetupScreen';

const muiTheme = getMuiTheme();

class App extends PureComponent {
  static propTypes = {
    user: PropTypes.object, // @TODO
    serverId: PropTypes.oneOfType([PropTypes.string, null]),
    firstVisit: PropTypes.bool,
  };

  componentDidMount() {
    this.props.dispatch(fetchMessages());
  }

  render() {
    const {
      conversations,
      activeConversationId,
      activeConversationMessages,
      serverId,
      user,
      firstVisit,
    } = this.props;

    let content;

    if (!firstVisit && user && serverId !== null) {
      content = (<div className={style.app}>
        <Toolbar className={style.header}>
          <Avatar className={style.headerAvatar}>S</Avatar>
          <ToolbarSeparator style={{ margin: '0 24px', top: 0 }} />
          <span>{user.displayName}</span>
        </Toolbar>
        <ConversationList
          className={style.conversation_list}
          activeConversationId={activeConversationId}
          conversations={toArray(conversations)}
        />
        <ChatView
          className={style.chat_view}
          conversationId={activeConversationId}
          messages={activeConversationMessages}
          info={conversations[activeConversationId]}
        />
      </div>);
    } else if (firstVisit) {
      content = (<Dialog modal open>
        <ProfileSetupScreen />
      </Dialog>);
    } else if (serverId === null) {
      content = (<Dialog modal open>
        <ServerSelectionScreen />
      </Dialog>);
    }

    return (<MuiThemeProvider muiTheme={muiTheme}>{content}</MuiThemeProvider>);
  }
}

export default connect(state => ({
  conversations: state.conversations,
  activeConversationId: state.activeConversationId,
  activeConversationMessages: getActiveConversationMessages(state),
  user: getThisUser(state),
  serverId: state.serverId,
  firstVisit: state.numVisits === 0,
}))(App);
