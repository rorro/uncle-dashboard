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
  leaderboard_channel: {
    name: 'Leaderboard Channel',
    description: 'This is where the bot posts everything leaderboard related. Speeds, pets, diary etc.'
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
  welcome_base_message: {
    name: 'Base Welcome Message',
    description: `The first part, that is always sent, of the welcome message.`
  },
  welcome_success_message: {
    name: 'Success Welcome Message',
    description: `This is added to the message if the welcome PM was successfully sent to the new member.`
  },
  welcome_error_message: {
    name: 'Error Welcome Message',
    description: `This is added to the message if the bot wasn't able to send the welcome PM to the new member.`
  },
  welcome_pm_message: {
    name: 'Welcome PM',
    description: `This is the welcome message the bot sends to the new member. A diary sheet link will be linked at the end of this message.`
  }
};
export default ConfigDescriptions;
