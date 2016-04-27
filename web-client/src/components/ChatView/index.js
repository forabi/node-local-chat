import React from 'react';
import PureComponent from 'react-pure-render/component';
import { connect } from 'react-redux';
import { sendMessageTo } from '../../actions';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import OnlineIcon from '../OnlineIcon';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SendIcon from 'material-ui/svg-icons/content/send';
import Message from '../Message';
import style from './style.css';
import SelectChat from './SelectChat';


export class ChatView extends PureComponent {
  state = {
    message: {
      text: '',
    },
  };

  onComponentDidMount() {
    if (this.refs.firstUnread) {
      this.refs.firstUnread.scrollIntoView();
    }
  }

  render() {
    const { conversationId, info, messages, dispatch } = this.props;
    let firstUnread = false;
    return (
      <div className={this.props.className}>
        <div className={style.root}>{
          !conversationId ? <SelectChat className={style.selectChat} /> :
          <div className={style.chatView}>
            <Toolbar className={style.header} noGutter>
                <ToolbarGroup>
                  <span>{info.displayName}</span>
                  <OnlineIcon isOnline={info.online} />
                </ToolbarGroup>
            </Toolbar>
            <div className={style.messagesList}>{
              messages.map((message, i) => {
                const direction = message.type === 'event' ? 'none' : message.from === conversationId ? 'left' : 'right';
                if (!firstUnread && message.unread) {
                  firstUnread = true;
                }
                return (
                  <div ref={firstUnread ? 'firstUnread' : undefined}
                    key={i}
                    className={
                      direction === 'none' ? style.messageContainerEvent : direction === 'left' ?
                      style.messageContainerLeft : style.messageContainerRight
                    }
                  >
                    <Message
                      direction={direction}
                      {...message} date={message.dateSent || message.dateReceived}
                      style={{ float: direction, clear: 'both' }}
                    />
                </div>);
              })
            }
            </div>
            {!info.online ? <span>{info.displayName} went offline</span> :
              <form className={style.composeForm}
                onSubmit={e => {
                  e.preventDefault();
                  dispatch(sendMessageTo(conversationId, this.state.message));
                  this.setState({ message: '' });
                }}
              >
                <TextField
                  className={style.inputField}
                  onChange={ e => this.setState({ message: { text: e.target.value } }) }
                  value={this.state.message.text}
                  hintText="Type a message"
                />
                <FloatingActionButton mini
                  type="submit"
                  disabled={!info.online || !this.state.message.text}
                >
                  <SendIcon />
                </FloatingActionButton>
              </form>
            }
          </div>}
        </div>
    </div>);
  }
}

export default connect()(ChatView);
