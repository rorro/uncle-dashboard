import './Dashboard.css';
import SidePanel from '../../components/SidePanel';
import { useState } from 'react';
import { getCookie } from '../../utils/cookie';
import Pill from '../../components/Pill';
import useFetch from '../../hooks/useFetch';
import { DashboardData } from '../../types';

const menuItems = [
  { key: 'messages', value: 'Messages' },
  { key: 'channels', value: 'Channels' },
  { key: 'config', value: 'Config' },
  { key: 'applications', value: 'Applications' },
  { key: 'tickets', value: 'Support Tickets' }
];

// TODO: store this in .env
const apiUrl = 'http://localhost:7373/dashboard';

function Dashboard() {
  const [selectedOption, setSelectedOption] = useState<string>('messages');

  const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedOption(event.currentTarget.value);
  };

  const cookie = getCookie('access_token');
  const { data } = useFetch<DashboardData>(`${apiUrl}?accessToken=${cookie}`);

  return (
    <div>
      <SidePanel menuItems={menuItems} handleClick={buttonHandler} />
      <div className="page-wrap">
        {data && <Pill label={data.guild.name} icon={data.guild.iconURL} />}
        <h2>Dashboard</h2>
        {data &&
          selectedOption === 'messages' &&
          data.messages.map(m => {
            return (
              <p key={m.id}>
                {m.name}, {m.message_id}, {m.type}
              </p>
            );
          })}
      </div>
    </div>
  );
}

export default Dashboard;
