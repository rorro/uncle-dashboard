import './Dashboard.css';
import SidePanel from '../../components/SidePanel';
import { useState } from 'react';
import Pill from '../../components/Pill';
import { DashboardData } from '../../types';
import MessagesTable from '../../components/MessagesTable';
import Config from '../../components/Config';
import ScheduledMessages from '../../components/ScheduledMessages';

const menuItems = [
  { key: 'config', value: 'Config' },
  { key: 'messages', value: 'Sent Messages' },
  { key: 'scheduled_messages', value: 'Scheduled Messages' }
  // { key: 'channels', value: 'Channels' },
  // { key: 'applications', value: 'Applications' },
  // { key: 'tickets', value: 'Support Tickets' }
];

function Dashboard({ data }: { data: DashboardData | undefined }) {
  const [selectedOption, setSelectedOption] = useState<string>('config');

  const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedOption(event.currentTarget.value);
  };

  const showData = (selectedOption: string): JSX.Element | undefined => {
    switch (selectedOption) {
      case 'messages':
        return data ? <MessagesTable messages={data.messages} /> : <p>You need to log in</p>;
      case 'config':
        console.log(`data in dashboard: ${data?.configs}`);

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
        <h2>Dashboard</h2>
        {showData(selectedOption)}
      </div>
    </div>
  );
}

export default Dashboard;
