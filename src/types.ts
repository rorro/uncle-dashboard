import { APIEmbed, APIEmbedField } from 'discord.js';
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
  channel: string;
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

export enum ChannelType {
  Text = 0,
  DM = 1,
  Voice = 2,
  GroupDM = 3,
  Category = 4,
  Announcement = 5,
  AnnouncementThread = 10,
  PublicThread = 11,
  PrivateThread = 12,
  StageVoice = 13,
  Directory = 14,
  Forum = 15
}

export interface GuildChannelEntry {
  type: ChannelType;
  id: string;
  name: string;
  parentId: string;
}

export interface ConfigEntry {
  new_members_channel: string | null;
  assign_roles_channel: string | null;
  rules_channel: string | null;
  diary_channel: string | null;
  leaderboard_channel: string | null;
  transcripts_channel: string | null;
  clan_icon: string | null;
  requirements_image: string | null;
  diary_top10_message: string | null;
}

export interface DashboardData {
  guild: {
    id: string;
    name: string;
    icon: string;
    roles: string[];
    memberCount: number;
    iconURL: string;
  };
  guildChannels: GuildChannelEntry[];
  messages: MessagesResponse[];
  configs: ConfigEntry;
  scheduledMessages: ScheduledMessageEntry[];
}

export interface OptGroupType {
  key: GuildChannelEntry;
  value: GuildChannelEntry[];
}

export interface ConfigDescription {
  [key: string]: { name: string; description: string };
}

export enum ScheduledMessageType {
  Simple = 1,
  Embed = 2
}

export interface ScheduledMessageEntry {
  id: number;
  message: string;
  date: string;
  channel: string;
  type: ScheduledMessageType;
}

export interface ExtendedAPIEmbedField extends APIEmbedField {
  key: string;
}

export interface UpdateMessageOptions {
  content?: string | undefined;
  embed?: APIEmbed | undefined;
  date?: string;
  channel?: string;
}
