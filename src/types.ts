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

export interface OptionProps {
  label: string;
  index: number;
}
