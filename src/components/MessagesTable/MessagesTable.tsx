import { MessagesResponse, MessageType } from '../../types';
import './MessagesTable.css';

function MessagesTable({ messages }: { messages: MessagesResponse[] }) {
  return (
    <table className="table">
      <tbody>
        <tr>
          <th className="table-head">Name</th>
          <th className="table-head">Channel</th>
          <th className="table-head">Message ID</th>
          <th className="table-head">Type</th>
        </tr>
        {messages.map(m => {
          return (
            <tr id="table-row" key={m.id}>
              <td className="table-data">{m.name}</td>
              <td className="table-data">{m.channel}</td>
              <td className="table-data">{m.message_id}</td>
              <td className="table-data">{MessageType[m.type]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default MessagesTable;
