import React from 'react';
import { MessagesResponse } from '../../types';

function Messages({ messages }: { messages: MessagesResponse[] }) {
  return (
    <div>
      <ul>
        {messages.map(m => {
          return (
            <li key={m.id}>
              {m.name}: {m.message_id}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Messages;
