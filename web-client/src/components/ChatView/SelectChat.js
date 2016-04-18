import React from 'react';
import SelectChatIcon from './interface.svg';

const SelectChat = (props) => (
  <div {...props}>
    <div style={{ textAlign: 'center' }}>
      <SelectChatIcon style={{ maxWidth: '50%' }} />
      <h2>Select someone to chat with</h2>
    </div>
  </div>
);

export default SelectChat;
