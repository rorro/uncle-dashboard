import { LeaderboardBoss, LeaderboardRecord, SpeedsLeaderboardEntry } from '../types';
import { timeInHumanReadable, timeInMilliseconds } from './preciseTimes';

export function buildBoardMessage(boss: LeaderboardBoss, entries: SpeedsLeaderboardEntry[]): string {
  let message = `${boss.emoji} ${boss.boss} ${boss.emoji}\n\`\`\`ini\n`;

  if (!boss.categories) {
    if (!entries.length) {
      for (let i = 0; i < 3; i++) {
        message += `[#${+i + 1}] \n`;
      }
    } else {
      const { values, indexes, top } = getTopSpeedIndexes(entries, 3);

      for (let i = 0; i < 3; i++) {
        if (top[i] === undefined) {
          message += `[#${+i + 1}] \n`;
        } else {
          message += `[#${+i + 1}] ( ${timeInHumanReadable(top[i])} )\n`;
          let names = [];
          for (let j in indexes[top[i]]) {
            const index = indexes[top[i]][j];
            const leaderboardEntry = values[index];
            names.push('  ' + leaderboardEntry.name);
          }

          message += `${names.join('\n')}\n`;
        }
      }
    }
    message += `\`\`\``;
  } else {
    for (const category of boss.categories) {
      const categoryBoard = entries.filter(c => c.category === category && !c.removed);

      if (!categoryBoard.length) {
        message += `[${category}]\n`;
        continue;
      }

      const { values, top } = getTopSpeedIndexes(categoryBoard, 1);
      message += `[${category}] ${`( ${timeInHumanReadable(top[0])} )`}\n`;

      let names = [];
      for (let i = 0; i < values.length; i++) {
        if (values[i].value === top[0]) {
          names.push('  ' + values[i].name);
        }
      }

      message += names.length === 0 ? '' : `${names.join('\n')}\n`;
    }
    message += `\`\`\``;
  }

  return message;
}

function getTopSpeedIndexes(data: SpeedsLeaderboardEntry[], places: number) {
  const values = data
    .map(entry => ({
      name: entry.username,
      value: timeInMilliseconds(entry.time)
    }))
    .sort((e1, e2) => e1.value - e2.value);

  let indexes: LeaderboardRecord = {};
  for (let i: number = 0; i < values.length; i++) {
    const { name, value } = values[i];
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
