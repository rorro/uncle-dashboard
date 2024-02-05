import { ChangeEvent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  LeaderboardBoss,
  SpeedsLeaderboardEntry,
  ToastType,
  AllTopInterface,
  BoardInterface,
  BoardUpdates
} from '../../types';
import './SpeedsLeaderboard.css';
import LeaderboardBosses from '../../leaderboardBosses';
import BossLine from './BossLine';
import { getStorage } from '../../utils/storage';
import sendToast from '../../utils/toast';
import { findNextMultiple, timeInHumanReadable } from '../../utils/preciseTimes';
import { buildBoardMessage, getTopThree } from '../../utils/topThreeLeaderboard';
import Collapsible from '../../components/Collapsible';
import EmbedPreview from '../../components/EmbedPreview';

function SpeedsLeaderboard({ speedsLeaderboard }: { speedsLeaderboard: SpeedsLeaderboardEntry[] }) {
  const ALL_ZERO = '00:00:00.00';

  const [leaderboard, setLeaderboard] = useState<SpeedsLeaderboardEntry[]>(speedsLeaderboard);
  const [previousLeaderboard, setPreviousLeaderboard] =
    useState<SpeedsLeaderboardEntry[]>(speedsLeaderboard);
  const [boardChanged, setboardChanged] = useState<boolean>(false);
  const [correctFormat, setCorrectFormat] = useState<Record<number, boolean>>({});
  const [preciseTime, setPreciseTime] = useState<string>(ALL_ZERO);
  const [boardUpdates, setBoardUpdates] = useState<BoardUpdates>({});

  const timeRegex: RegExp = /^(?:(?:[1-9]\d*:)?(?:[0-5]?\d:[0-5]?\d\.\d{1,2})|(?:[0-5]?\d\.\d{1,2}))$/;
  const nonPreciseTimeRegex: RegExp = /^(?:(?:\d+):)?(?:[0-5]?\d:)?(?:[0-5]?\d)$/;

  function convertToPrecice(e: ChangeEvent<HTMLInputElement>) {
    const time = e.currentTarget.value;

    const correctFormat = nonPreciseTimeRegex.test(time);

    const preciseTime = correctFormat ? findNextMultiple(e.currentTarget.value) : ALL_ZERO;

    setPreciseTime(preciseTime);
  }

  function addTime(boss: LeaderboardBoss, category: string | null) {
    const id = Math.random();
    const newTime = {
      id: id,
      username: '',
      boss: boss.boss,
      category: category,
      time: '',
      proof: '',
      removed: 0
    };

    setCorrectFormat({ ...correctFormat, [id]: false });
    setLeaderboard([...leaderboard, newTime]);
  }

  function handleRemove(id: number, hardDelete: boolean) {
    let i = leaderboard.findIndex((speedEntry: SpeedsLeaderboardEntry) => speedEntry.id === id);
    if (i === -1) return;

    const tempBoard = [...leaderboard];
    if (hardDelete) {
      tempBoard.splice(i, 1);
    } else {
      const updatedObject = Object.assign({}, leaderboard[i], {
        removed: leaderboard[i].removed ? 0 : 1
      });
      tempBoard[i] = updatedObject;
    }

    const tempFormat = { ...correctFormat };
    delete tempFormat[id];

    setCorrectFormat(tempFormat);
    setLeaderboard(tempBoard);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const [id, field] = e.currentTarget.name.split(':');
    const value = e.currentTarget.value;

    let correct = false;
    if (field === 'time' && !timeRegex.test(value)) {
      e.currentTarget.style.color = 'red';
    } else {
      e.currentTarget.style.color = 'white';
      correct = true;
    }

    setCorrectFormat(prevState => {
      return { ...prevState, [id]: correct };
    });

    let i = leaderboard.findIndex(
      (speedEntry: SpeedsLeaderboardEntry) => speedEntry.id.toString() === id
    );
    if (i === -1) return;

    const updatedObject = Object.assign({}, leaderboard[i], { [field]: value });
    const tempBoard = [...leaderboard];
    tempBoard[i] = updatedObject;

    setLeaderboard(tempBoard);
  }

  async function handleUpdate(boss: LeaderboardBoss) {
    const token = getStorage('access_token');

    const payload = {
      access_token: token,
      boss: boss,
      category: 'speed'
    };

    await fetch(
      `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/uncle/dashboard/updateleaderboard`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )
      .then(response => response.json())
      .then((data: { message: string }) => {
        if (!data.message.toLowerCase().includes('success')) {
          sendToast(data.message, ToastType.Error);
          return;
        } else {
          setPreviousLeaderboard(leaderboard);
          sendToast(data.message, ToastType.Success);
          return;
        }
      });
  }

  async function handleSave() {
    if (Object.values(correctFormat).some(value => value === false)) {
      sendToast('One of the times has the wrong format or is left empty', ToastType.Error);
      return;
    }

    const token = getStorage('access_token');

    await fetch(
      `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/uncle/dashboard/savedata?accessToken=${token}&category=speeds`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leaderboard)
      }
    )
      .then(response => response.json())
      .then((data: { message: string }) => {
        if (!data.message.toLowerCase().includes('success')) {
          sendToast(data.message, ToastType.Error);
          return;
        } else {
          const top3before = getTopThree(previousLeaderboard);
          const top3after = getTopThree(leaderboard);

          // Find differences for before and after the changes
          const updates = findDifferences(top3before, top3after);
          setBoardUpdates(previousUpdates => {
            const keysToUpdate = Object.keys(updates);
            for (const key of keysToUpdate) {
              if (previousUpdates.hasOwnProperty(key)) {
                return {
                  ...previousUpdates,
                  [key]: {
                    fellOff: [...previousUpdates[key].fellOff, ...updates[key].fellOff],
                    newEntry: [...previousUpdates[key].newEntry, ...updates[key].newEntry],
                    improved: [...previousUpdates[key].improved, ...updates[key].improved]
                  }
                };
              } else {
                return {
                  ...previousUpdates,
                  ...updates
                };
              }
            }

            return updates;
          });

          setPreviousLeaderboard(leaderboard);
          sendToast(data.message, ToastType.Success);
          return;
        }
      });
  }

  async function handlePostChangelog() {
    const token = getStorage('access_token');

    await fetch(
      `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/uncle/dashboard/leaderboardchangelog?accessToken=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ changelog: createUpdatesContent(boardUpdates) })
      }
    )
      .then(response => response.json())
      .then((data: { message: string }) => {
        if (!data.message.toLowerCase().includes('success')) {
          sendToast(data.message, ToastType.Error);
          return;
        } else {
          sendToast(data.message, ToastType.Success);
          setBoardUpdates({});
          return;
        }
      });
  }

  useEffect(() => {
    const changed = JSON.stringify(leaderboard) !== JSON.stringify(previousLeaderboard);

    setboardChanged(changed);
  }, [leaderboard, previousLeaderboard]);

  return (
    <>
      <div className="wrap">
        <div className="button-wrapper">
          <button
            className="save-speeds"
            onClick={handleSave}
            style={boardChanged ? {} : { pointerEvents: 'none', backgroundColor: '#444444' }}
          >
            <span>Save</span>
          </button>
          <button
            className="post-updates"
            onClick={handlePostChangelog}
            style={
              Object.keys(boardUpdates).length > 0
                ? {}
                : { pointerEvents: 'none', backgroundColor: '#444444' }
            }
          >
            <span>Post Updates</span>
          </button>
        </div>
        <div className="precise-time">
          <label htmlFor="precise-time-input">Time to Precise time</label>
          <input
            id="precise-time-input"
            type="text"
            placeholder="Time"
            onChange={e => convertToPrecice(e)}
          />
          <input id="precise-time-result" type="text" value={preciseTime} readOnly />
        </div>
        <Collapsible title="Board Changes">
          <EmbedPreview embed={{}} content={createUpdatesContent(boardUpdates)} />
        </Collapsible>
        {LeaderboardBosses.map(b => {
          return (
            <BossLine
              boss={b}
              data={leaderboard.filter(e => e.boss === b.boss)}
              saved={!boardChanged}
              previewContent={buildBoardMessage(
                b,
                leaderboard.filter(e => e.boss === b.boss && !e.removed)
              )}
              key={b.boss}
              addTime={addTime}
              handleChange={handleChange}
              handleRemove={handleRemove}
              handleUpdate={handleUpdate}
            />
          );
        })}
      </div>
    </>
  );
}

function findDifferences(previousTop3: AllTopInterface, currentTop3: AllTopInterface) {
  const updates: BoardUpdates = {};
  Object.entries(previousTop3).forEach(([boss, entry]) => {
    const currentTop = currentTop3[boss];
    const bossInfo = LeaderboardBosses.find(b => b.boss === boss);

    // No change for this boss
    if (areObjectsEqual(entry, currentTop)) return;

    if (entry.length === 3) {
      // No categories
      updates[`${bossInfo?.emoji} ${boss} ${bossInfo?.emoji}`] = getUpdates(entry, currentTop);
    } else {
      // Has categories

      const categories = bossInfo?.categories;
      if (categories !== undefined) {
        for (const category of categories) {
          const categoryEntry = entry.filter(e => e.category === category);
          const categoryCurrentTop = currentTop.filter(e => e.category === category);

          const { fellOff, newEntry, improved } = getUpdates(categoryEntry, categoryCurrentTop);

          if (fellOff.length === 0 && newEntry.length === 0 && improved.length === 0) continue;

          updates[`${bossInfo?.emoji} ${boss} ${bossInfo?.emoji}/${category}`] = {
            fellOff,
            newEntry,
            improved
          };
        }
      }
    }
  });

  return updates;
}

function areObjectsEqual(obj1: BoardInterface[], obj2: BoardInterface[]) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function getUpdates(entry: BoardInterface[], currentTop: BoardInterface[]) {
  const updates: { fellOff: string[]; newEntry: string[]; improved: string[] } = {
    fellOff: [],
    newEntry: [],
    improved: []
  };
  const previousNames = entry
    .map(e => (e.name !== null ? [...e.name] : []))
    .reduce((acc, val) => [...acc, ...val], []);

  const currentNames = currentTop
    .map(e => (e.name !== null ? [...e.name] : []))
    .reduce((acc, val) => [...acc, ...val], []);

  const fellOff = previousNames.filter(n => !currentNames.includes(n));
  const newEntry = currentNames.filter(n => !previousNames.includes(n));
  const inCommon = previousNames.filter(n => currentNames.includes(n));

  // Someone fell off the board
  if (fellOff.length > 0) {
    for (const name of fellOff) {
      const time = entry.find(c => c.name?.includes(name))?.time;

      if (time) {
        updates.fellOff.push(`**${name}**: \`${timeInHumanReadable(time)}\``);
      }
    }
  }

  // Someone entered the board
  if (newEntry.length > 0) {
    for (const name of newEntry) {
      const time = currentTop.find(c => c.name?.includes(name))?.time;

      if (time) {
        updates.newEntry.push(`**${name}**: \`${timeInHumanReadable(time)}\``);
      }
    }
  }

  // These names remained on the board. Let's see if they improved their time or not.
  if (inCommon.length > 0) {
    for (const name of inCommon) {
      const previousTime = entry.find(c => c.name?.includes(name))?.time;
      const newTime = currentTop.find(c => c.name?.includes(name))?.time;

      if (previousTime && newTime && newTime < previousTime) {
        updates.improved.push(
          `**${name}**: \`${timeInHumanReadable(previousTime)}\` -> \`${timeInHumanReadable(newTime)}\``
        );
      }
    }
  }

  return updates;
}

function createUpdatesContent(boardUpdates: BoardUpdates) {
  let content = `# ${dayjs().format('YYYY-MM-DD')}\n\n`;

  Object.entries(boardUpdates).forEach(([boss, change]) => {
    const [b, c] = boss.split('/');

    content += `## ${c ? b + ' ' + c : b} \n`;
    const newEntries = change.newEntry.length > 0;
    const fellOffs = change.fellOff.length > 0;
    const improvements = change.improved.length > 0;

    if (newEntries) content += ':tada: Entered board\n';
    for (const entry of change.newEntry) {
      content += ` ${entry}\n`;
    }
    if (newEntries) content += '\n';

    if (fellOffs) content += ':wave: Fell off\n';
    for (const fellOff of change.fellOff) {
      content += ` ${fellOff}\n`;
    }
    if (fellOffs) content += '\n';

    if (improvements) content += ':stopwatch: Improved their time\n';
    for (const improved of change.improved) {
      content += ` ${improved}\n`;
    }
    if (improvements) content += '\n';
  });

  return content;
}

export default SpeedsLeaderboard;
