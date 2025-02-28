import './Dashboard.css';
import SidePanel from '../../components/SidePanel';
import { useState } from 'react';
import Pill from '../../components/Pill';

import { DashboardData } from '../../types';
import MessagesTable from '../../components/MessagesTable';
import Config from '../../components/Config';
import ScheduledMessages from '../../components/ScheduledMessages';
import useFetch from '../../hooks/useFetch';
import { getStorage } from '../../utils/storage';
import Embeds from '../Embeds';
import PetsLeaderboard from '../PetsLeaderboard';
import { ToastContainer } from 'react-toastify';
import SpeedsLeaderboard from '../SpeedsLeaderboard';

const menuItems = [
  { key: 'config', value: 'Config' },
  { key: 'messages', value: 'Sent Messages' },
  { key: 'scheduled_messages', value: 'Scheduled Messages' },
  { key: 'embeds', value: 'Embeds' },
  { key: 'pets_leaderboard', value: 'Pets Leaderboard' },
  { key: 'speeds_leaderboard', value: 'Speeds Leaderboard' }
];

function getName(option: string): string {
  return menuItems.filter(mi => mi.key === option)[0].value;
}

function Dashboard() {
  const apiUrl = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/uncle/dashboard`;
  const token = getStorage('access_token');
  const { data } = useFetch<DashboardData>(`${apiUrl}?accessToken=${token}`);
  const [selectedOption, setSelectedOption] = useState<string>('config');

  const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedOption(event.currentTarget.value);
  };

  const showData = (selectedOption: string): JSX.Element | undefined => {
    if (!data) return <p>Please log in to access the dashboard.</p>;
    switch (selectedOption) {
      case 'config':
        return <Config guildChannels={data.guildChannels} />;
      case 'messages':
        return <MessagesTable />;
      case 'scheduled_messages':
        return <ScheduledMessages guildChannels={data.guildChannels} />;
      case 'embeds':
        return <Embeds />;
      case 'pets_leaderboard':
        return <PetsLeaderboard />;
      case 'speeds_leaderboard':
        return <SpeedsLeaderboard />;
    }
  };

  return (
    <>
      <ToastContainer style={{ fontSize: '.8em' }} />
      <div>
        {data && <SidePanel menuItems={menuItems} handleClick={buttonHandler} />}
        <div className="page-wrap">
          {data && data.guild && <Pill label={data.guild.name} icon={data.guild.iconURL} />}
          <h2>{getName(selectedOption)}</h2>
          {showData(selectedOption)}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
