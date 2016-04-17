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

export class ChatView extends PureComponent {
  state = {
    message: '',
  };

  onComponentDidMount() {
    // @TODO: scroll to first unread message
  }

  render() {
    const { conversationId, info, messages, dispatch } = this.props;
    console.log(this.state);
    return (<div className={this.props.className}>{
      !conversationId ? <span>Select someone on the left to start chatting</span> : <div className={style.root}>
        <Toolbar className={style.header} noGutter>
            <ToolbarGroup>
              <span>{info.displayName}</span>
              <OnlineIcon isOnline={info.online} />
            </ToolbarGroup>
        </Toolbar>
        <div className={style.messagesList}>
          { messages && <ol>{ messages.map((message, i) => <Message key={i} {...message}/> ) }</ol> }
        </div>
        <form className={style.composeForm}
          onSubmit={e => {
            e.preventDefault();
            dispatch(sendMessageTo(conversationId, this.state.message));
            this.setState({ message: '' });
          }}
        >
          <TextField
            className={style.inputField}
            onChange={ e => this.setState({ message: e.target.value }) }
            value={this.state.message}
            hintText="Type a message"
          />
          <FloatingActionButton mini
            type="submit"
            disabled={!info.online || !this.state.message}
          >
            <SendIcon />
          </FloatingActionButton>
        </form>
      </div>}
    </div>);
  }
}

export default connect()(ChatView);
