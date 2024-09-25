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
  inactivity_check_channel: string | null;
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
  petsLeaderboard: PetLeaderboardEntry[];
  speedsLeaderboard: SpeedsLeaderboardEntry[];
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
  removed: number;
  abyssal_sire: number;
  alchemical_hydra: number;
  callisto: number;
  cerberus: number;
  chaos_elemental: number;
  commander_zilyana: number;
  corporeal_beast: number;
  dagannoth_prime: number;
  dagannoth_supreme: number;
  dagannoth_rex: number;
  tztok_jad: number;
  general_graardor: number;
  giant_mole: number;
  grotesque_guardians: number;
  tzkal_zuk: number;
  kalphite_queen: number;
  king_black_dragon: number;
  kraken: number;
  kreearra: number;
  kril_tsutsaroth: number;
  scorpia: number;
  skotizo: number;
  thermonuclear_smoke_devil: number;
  venenatis: number;
  vetion: number;
  vorkath: number;
  phoenix: number;
  zulrah: number;
  chambers_of_xeric: number;
  theatre_of_blood: number;
  bloodhound: number;
  penance_queen: number;
  heron: number;
  rock_golem: number;
  beaver: number;
  chinchompa: number;
  giant_squirrel: number;
  tangleroot: number;
  rocky: number;
  rift_guardian: number;
  herbiboar: number;
  chompy_chick: number;
  sarachnis: number;
  zalcano: number;
  gauntlet: number;
  nightmare: number;
  lil_creator: number;
  tempoross: number;
  nex: number;
  abyssal_protector: number;
  tombs_of_amascut: number;
  phantom_muspah: number;
  the_whisperer: number;
  duke_sucellus: number;
  vardorvis: number;
  the_leviathan: number;
  scurrius: number;
  sol_heredit: number;
  quetzin: number;
  araxxor: number;
  the_hueycoatl: number;
  amoxliatl: number;
}

export interface SpeedsLeaderboardEntry {
  id: number;
  username: string;
  boss: string;
  category: string | null;
  time: string;
  proof: string | null;
  removed: number;
}

export interface LeaderboardBoss {
  boss: string;
  emoji: string;
  categories?: string[];
}

export enum ToastType {
  Error = 1,
  Success = 2
}

export interface LeaderboardRecord {
  [key: number]: [number];
}

export interface BoardInterface {
  name: string[] | null;
  time: number | null;
  category?: string;
}

export interface AllTopInterface {
  [key: string]: BoardInterface[];
}

export interface BoardUpdates {
  [key: string]: {
    fellOff: string[];
    newEntry: string[];
    improved: string[];
  };
}
