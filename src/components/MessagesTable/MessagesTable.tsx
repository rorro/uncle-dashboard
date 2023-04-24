import { MessagesResponse, MessageType } from '../../types';
import './MessagesTable.css';

function MessagesTable({ messages }: { messages: MessagesResponse[] }) {
 return (
    <table className="table">
      <tbody>
        <tr>
          <th>Name</th>
          <th>Channel</th>
          <th>Message ID</th>
          <th>Type</th>
        </tr>
        {messages.map(m => {
          return (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.channel}</td>
              <td>{m.message_id}</td>
              <td>{MessageType[m.type]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default MessagesTable;
