import { useEffect, useState } from 'react';
import { MessagesResponse, MessageType } from '../../types';
import './MessagesTable.css';
import { getStorage } from '../../utils/storage';

function MessagesTable() {
  const [sentMessages, setSentMessages] = useState<MessagesResponse[]>([]);

  async function getSentMessages() {
    const embedConfigsUrl = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/uncle/dashboard/sentmessages`;
    const token = getStorage('access_token');
    await fetch(`${embedConfigsUrl}?accessToken=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((data: MessagesResponse[]) => {
        setSentMessages(data);
      });
  }

  useEffect(() => {
    const fetchData = async () => {
      await getSentMessages();
    };
    fetchData();
  }, []);

  return (
    <table className="table">
      <tbody>
        <tr>
          <th className="table-head">Name</th>
          <th className="table-head">Channel</th>
          <th className="table-head">Message ID</th>
          <th className="table-head">Type</th>
        </tr>
        {sentMessages.map(m => {
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
