import { MouseEventHandler } from 'react';

export interface OpenApplicationsResponse {
  id: number;
  user_id: string;
  channel_id: string;
}

export enum MessageType {
  Leaderboard = 1,
  Pets = 2,
  Other = 3
}

export interface MessagesResponse {
  id: number;
  name: string;
  message_id: string;
  type: MessageType;
}

export interface NavBarProps {
  icon: string;
  title: string;
  button: Button;
}

export interface Button {
  label: string;
  handleClick: MouseEventHandler;
}

export interface MenuOptionProp {
  key: string;
  value: string;
}

export interface DashboardData {
  guild: {
    id: string;
    name: string;
    icon: string;
    channels: string[];
    roles: string[];
    memberCount: number;
    iconURL: string;
  };
  channels: [
    {
      configuredChannel: {
        id: number;
        channel: string;
        channel_id: String;
      };
      channel: {
        type: number;
        guild: string;
        guildId: string;
      };
    }
  ];
  messages: MessagesResponse[];
  configs: [
    {
      id: number;
      config_key: string;
      config_value: string;
    }
  ];
}
