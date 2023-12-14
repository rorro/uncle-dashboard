import { APIEmbed } from 'discord.js';
import { LeaderboardBoss, LeaderboardRecord, SpeedsLeaderboardEntry } from '../types';
import { timeInHumanReadable, timeInMilliseconds } from './preciseTimes';

const RANK_EMOJIS = [':first_place:', ':second_place:', ':third_place:'];

export function buildBoardMessage(boss: LeaderboardBoss, entries: SpeedsLeaderboardEntry[]): APIEmbed {
  let message = ``;
  const embed: APIEmbed = { title: `${boss.emoji} ${boss.boss}` };

  if (!boss.categories) {
    if (!entries.length) {
      for (let i = 0; i < 3; i++) {
        message += `${RANK_EMOJIS[i]} - \n`;
      }
    } else {
      const { values, indexes, top } = getTopSpeedIndexes(entries, 3);

      for (let i = 0; i < 3; i++) {
        if (top[i] === undefined) {
          message += `${RANK_EMOJIS[i]} - \n`;
        } else {
          message += `${RANK_EMOJIS[i]} **${timeInHumanReadable(top[i])}** \n`;
          let names = [];
          for (let j in indexes[top[i]]) {
            const index = indexes[top[i]][j];
            const leaderboardEntry = values[index];
            names.push('  ' + leaderboardEntry.name);
            message += `${'\u200b '.repeat(7)} ${leaderboardEntry.name} - ${
              leaderboardEntry.proof ? '[Proof](' + leaderboardEntry.proof + ')' : 'Proof missing'
            } \n`;
          }
        }
      }
    }
  } else {
    for (const category of boss.categories) {
      const categoryBoard = entries.filter(c => c.category === category && !c.removed);
      message += `**${category}**\n`;

      if (!categoryBoard.length) {
        for (let i = 0; i < 3; i++) {
          message += `${RANK_EMOJIS[i]} - \n`;
        }
        message += '\n';
        continue;
      }

      const { values, indexes, top } = getTopSpeedIndexes(categoryBoard, 3);

      for (let i = 0; i < 3; i++) {
        if (top[i] === undefined) {
          message += `${RANK_EMOJIS[i]} - \n`;
        } else {
          message += `${RANK_EMOJIS[i]} **${timeInHumanReadable(top[i])}** \n`;
          for (let j in indexes[top[i]]) {
            const index = indexes[top[i]][j];
            const leaderboardEntry = values[index];
            message += `${'\u200b '.repeat(7)} ${leaderboardEntry.name} - ${
              leaderboardEntry.proof ? '[Proof](' + leaderboardEntry.proof + ')' : 'Proof missing'
            } \n`;
          }
        }
      }
      message += '\n';
    }
  }
  embed.description = message;

  return embed;
}

function getTopSpeedIndexes(data: SpeedsLeaderboardEntry[], places: number) {
  const values = data
    .map(entry => ({
      name: entry.username,
      value: timeInMilliseconds(entry.time),
      proof: entry.proof
    }))
    .sort((e1, e2) => e1.value - e2.value);

  let indexes: LeaderboardRecord = {};
  for (let i: number = 0; i < values.length; i++) {
    const { value } = values[i];
    if (indexes[value]) {
      indexes[value].push(i);
    } else {
      indexes[value] = [i];
    }
  }

  const top = Object.keys(indexes)
    .map(Number)
    .sort((a, b) => a - b)
    .slice(0, places);

  return { values, indexes, top };
}
