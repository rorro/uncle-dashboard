import { ConfigDescription } from './types';

const ConfigDescriptions: ConfigDescription = {
  new_members_channel: {
    name: 'New Members Channel',
    description: 'This is where new members will get a public introduction message from the bot.'
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
  welcome_base_message: {
    name: 'Welcome Message',
    description: `The message sent in the New Members Channel. You can tag the new member with <@user>.`
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
    name: 'Personal message',
    description: `This message is sent as the content in the applicant channel together with the embed. You can tag the new member with <@user>.`
  },
  inactivity_check_channel: {
    name: 'Inactivity Check Channel',
    description:
      '30 days after someone has been accepted to the clan an inactivity check message is sent to this channel.'
  },
  logs_channel: {
    name: 'Logs Channel',
    description: 'Any logs will be sent here as messages.'
  }
};
export default ConfigDescriptions;
