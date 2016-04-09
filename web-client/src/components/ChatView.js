import React from 'react';
import { connect } from 'react-redux';
import { sendMessageTo, setDraftTo } from '../actions';


export class ChatView extends React.Component {
  render() {
    const { conversationId, info, messages, draft, dispatch } = this.props;
    return (<div>
      <header>
        {info.name}
      </header>
      { messages && <ol>{ messages.map((message, i) => <li key={i}>{message.text}</li>) }</ol> }
      <input
        ref="messageInput"
        type="text" placeholder="Type a message"
        onChange={ e => {
          dispatch(setDraftTo(conversationId, e.target.value));
        }}
      />
      <button
        type="submit"
        disabled={!this.refs.messageInput}
        onClick={ () => {
          dispatch(sendMessageTo(conversationId, draft));
          this.refs.messageInput.value = '';
        }}
      >
        Send
      </button>
    </div>);
  }
}

export default connect()(ChatView);
