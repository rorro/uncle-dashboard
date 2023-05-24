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
  leaderboard_channel: string | null;
  transcripts_channel: string | null;
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
  embedConfigs: EmbedConfigs;
  pets: PetEntry[];
  petsLeaderboard: PetLeaderboardEntry[];
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

export interface EmbedConfigs {
  application_embed: string;
  support_embed: string;
}

export interface ExtendedAPIEmbedField extends APIEmbedField {
  key: string;
}

export interface UpdateMessageOptions {
  content?: string;
  embed?: APIEmbed;
  date?: string;
  channel?: string;
}

export interface DeleteModalOptions {
  messageId: number;
  date: string;
  channel: string;
  embed: APIEmbed;
}

export interface PetEntry {
  name: string;
  display_name: string;
  emoji: string;
}

export interface PetLeaderboardEntry {
  id: number;
  username: string;
  abyssal_sire: number;
  giant_mole: number;
  callisto: number;
  cerberus: number;
  alchemical_hydra: number;
  tzkal_zuk: number;
  kalphite_queen: number;
  theatre_of_blood: number;
  phantom_muspah: number;
  nightmare: number;
  nex: number;
  grotesque_guardians: number;
  chambers_of_xeric: number;
  chaos_elemental: number;
  dagannoth_prime: number;
  dagannoth_rex: number;
  dagannoth_supreme: number;
  corporeal_beast: number;
  general_graardor: number;
  kril_tsutsaroth: number;
  kraken: number;
  kreearra: number;
  thermonuclear_smoke_devil: number;
  zulrah: number;
  commander_zilyana: number;
  king_black_dragon: number;
  scorpia: number;
  skotizo: number;
  sarachnis: number;
  tombs_of_amascut: number;
  tztok_jad: number;
  venenatis: number;
  vetion: number;
  vorkath: number;
  chinchompa: number;
  beaver: number;
  giant_squirrel: number;
  heron: number;
  rift_guardian: number;
  rock_golem: number;
  rocky: number;
  tangleroot: number;
  bloodhound: number;
  chompy_chick: number;
  herbiboar: number;
  lil_creator: number;
  penance_queen: number;
  phoenix: number;
  tempoross: number;
  gauntlet: number;
  zalcano: number;
  abyssal_protector: number;
}

export enum ToastType {
  Error = 1,
  Success = 2
}
