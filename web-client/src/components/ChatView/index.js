import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import { connect } from 'react-redux';
import { sendMessageTo, markMessageAsRead } from '../../actions';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import OnlineIcon from '../OnlineIcon';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SendIcon from 'material-ui/svg-icons/content/send';
import Message from '../Message';
import style from './style.css';
import Placeholder from '../Placeholder';
import ChatIcon from './multimedia.svg';
import { messageShape } from '../propTypes';

export class ChatView extends PureComponent {
  state = {
    message: {
      text: '',
      type: 'text',
    },
  };

  static propTypes = {
    // @TODO: do not show 'select someone to chat with if no clients are online'
    clientsAvailable: PropTypes.bool.isRequired,
    converstionId: PropTypes.oneOf([null, PropTypes.string.isRequired]),
    messages: PropTypes.arrayOf(messageShape),
    info: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      online: PropTypes.bool.isRequired,
    }).isRequired,
  };

  onComponentDidMount() {
    if (this.refs.firstUnread) {
      this.refs.firstUnread.scrollIntoView();
    }
  }

  onMessageVisible(message, dispatch) {
    console.log('Checking...', message);
    if (message.incoming && message.status !== 'read') {
      console.log('Marking message as read...');
      dispatch(markMessageAsRead(message));
    }
  }

  render() {
    const { conversationId, info, messages, dispatch } = this.props;
    let firstUnread = false;
    return (
      <div className={this.props.className}>
        <div className={style.root}>{
          !conversationId ? <Placeholder icon={ChatIcon} title="Select someone to chat with" /> :
            <div className={style.chat_view}>
              <Toolbar className={style.header} noGutter>
                <ToolbarGroup>
                  <span>{info.displayName}</span>
                  <OnlineIcon isOnline={info.online} />
                </ToolbarGroup>
              </Toolbar>
              <div className={style.message_list}>{
                messages.map(message => {
                  let direction; let className;
                  if (message.type === 'event') {
                    direction = 'none';
                    className = style.message_container__event;
                  } else if (message.incoming) {
                    direction = 'left';
                    className = style.message_container__left;
                  } else {
                    direction = 'right';
                    className = style.message_container__right;
                  }
                  if (!firstUnread && message.incoming && message.status !== 'read') {
                    firstUnread = true;
                  }
                  return (
                    <div
                      ref={firstUnread ? 'firstUnread' : undefined}
                      key={message.id}
                      className={className}
                    >
                      <Message
                        direction={direction}
                        {...message}
                        style={{ float: direction, clear: 'both' }}
                        onVisible={() => this.onMessageVisible(message, dispatch)}
                      />
                    </div>
                  );
                })
              }
              </div>
            {info.online &&
              <div className={style.compose_container}>
                <form
                  className={style.compose_form}
                  onSubmit={e => {
                    e.preventDefault();
                    dispatch(sendMessageTo(conversationId, this.state.message));
                    this.setState({ message: '' });
                  }}
                >
                  <TextField
                    className={style.input}
                    onChange={e => {
                      this.setState({ message: { text: e.target.value, type: 'text' } });
                    }}
                    value={this.state.message.text}
                    hintText="Type a message"
                  />
                  <FloatingActionButton
                    mini type="submit"
                    disabled={!info.online || !this.state.message.text}
                  >
                    <SendIcon />
                  </FloatingActionButton>
                </form>
              </div>
            }
            </div>}
        </div>
      </div>);
  }
}

export default connect()(ChatView);
