import './Dashboard.css';
import SidePanel from '../../components/SidePanel';
import { useState } from 'react';
import Pill from '../../components/Pill';
import { DashboardData } from '../../types';
import MessagesTable from '../../components/MessagesTable';
import Config from '../../components/Config';
import ScheduledMessages from '../../components/ScheduledMessages';
import useFetch from '../../hooks/useFetch';
import { getCookie } from '../../utils/cookie';

const menuItems = [
  { key: 'config', value: 'Config' },
  { key: 'messages', value: 'Sent Messages' },
  { key: 'scheduled_messages', value: 'Scheduled Messages' }
  // { key: 'channels', value: 'Channels' },
  // { key: 'applications', value: 'Applications' },
  // { key: 'tickets', value: 'Support Tickets' }
];

function getName(option: string): string {
  return menuItems.filter(mi => mi.key === option)[0].value;
}

function Dashboard() {
  const apiUrl = `http://${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/dashboard`;
  const cookie = getCookie('access_token');
  const { data } = useFetch<DashboardData>(`${apiUrl}?accessToken=${cookie}`);
  const [selectedOption, setSelectedOption] = useState<string>('config');

  const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedOption(event.currentTarget.value);
  };

  const showData = (selectedOption: string): JSX.Element | undefined => {
    switch (selectedOption) {
      case 'messages':
        return data ? <MessagesTable messages={data.messages} /> : <p>You need to log in</p>;
      case 'config':
        return data && data.configs ? (
          <Config data={data.configs} guildChannels={data.guildChannels} />
        ) : (
          <p>Please log in to access the dashboard.</p>
        );
      case 'scheduled_messages':
        return data && data.scheduledMessages ? (
          <ScheduledMessages
            scheduledMessages={data.scheduledMessages}
            guildChannels={data.guildChannels}
          />
        ) : (
          <p>No sheduled messages here</p>
        );
    }
  };

  return (
    <div>
      {data && <SidePanel menuItems={menuItems} handleClick={buttonHandler} />}
      <div className="page-wrap">
        {data && data.guild && <Pill label={data.guild.name} icon={data.guild.iconURL} />}
        <h2>{getName(selectedOption)}</h2>
        {showData(selectedOption)}
      </div>
    </div>
  );
}

export default Dashboard;
