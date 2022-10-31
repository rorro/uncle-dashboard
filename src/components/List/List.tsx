import React from 'react';
import { MessagesResponse } from '../../types';
import './List.css';

function List(messages: MessagesResponse[]) {
  return (
    <div>
      <ul>
        {messages.map(m => {
          return (
            <li>
              {m.name}: {m.message_id}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default List;
