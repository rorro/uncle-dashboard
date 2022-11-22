import { ConfigDescription } from './types';

const ConfigDescriptions: ConfigDescription = {
  new_members_channel: {
    name: 'New Members Channel',
    description:
      'This is where new members will get an introduction message from the bot. Where they are instructed to introduce themselves.'
  },
  assign_roles_channel: {
    name: 'Assign Roles Channel',
    description: 'The channel where people can go to self-assign roles.'
  },
  rules_channel: { name: 'Rules Channel', description: 'Where the our rules are located.' },
  diary_channel: {
    name: 'Diary Channel',
    description: `The channel where the 'Diary Top 10 Message' is sent.`
  },
  leaderboard_channel: {
    name: 'Leaderboard Channel',
    description: 'This is where the bot posts everything leaderboard related. Speeds, pets etc.'
  },
  transcripts_channel: {
    name: 'Transcripts Channel',
    description:
      'Application transcripts are sent are sent to this channel. Make sure the selected channel is only visible to staff members.'
  },
  clan_icon: {
    name: 'Clan Icon',
    description: `The clan icon. It's shown in all the embeds that are sent by the bot. Make sure it's a valid url directly linking to an image.`
  },
  requirements_image: {
    name: 'Requirements Image',
    description: `The requirements image is the image shown to new applicants. Make sure it's a valid url directly linking to an image.`
  },
  diary_top10_message: {
    name: 'Diary Top 10 Message',
    description: 'This is the message that the bot edits when updating top 10 diary leaderboard.'
  }
};
export default ConfigDescriptions;
