import { ChangeEvent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  LeaderboardBoss,
  SpeedsLeaderboardEntry,
  ToastType,
  AllTopInterface,
  BoardInterface,
  BoardUpdates,
  FetchedSpeedLeaderboard,
  DeletedSpeedBoardEntry
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

function SpeedsLeaderboard() {
  const ALL_ZERO = '00:00:00.00';
  const [correctFormat, setCorrectFormat] = useState<Record<string, { id: number; correct: boolean }[]>>(
    {}
  );
  const [preciseTime, setPreciseTime] = useState<string>(ALL_ZERO);
  const [boardUpdates, setBoardUpdates] = useState<BoardUpdates>({});
  const [leaderBoards, setleaderBoards] = useState<FetchedSpeedLeaderboard>({});
  const [previousLeaderBoards, setpreviousLeaderBoards] = useState<FetchedSpeedLeaderboard>({});
  const [changedLeaderboards, setchangedLeaderboards] = useState<FetchedSpeedLeaderboard>({});
  const [deletedTimes, setDeletedTimes] = useState<DeletedSpeedBoardEntry>({});
  const [showRemovedTimes, setShowRemovedTimes] = useState<boolean>(false);

  const timeRegex: RegExp = /^(?:(?:[1-9]\d*:)?(?:[0-5]?\d:[0-5]?\d\.\d{1,2})|(?:[0-5]?\d\.\d{1,2}))$/;
  const nonPreciseTimeRegex: RegExp = /^(?:(?:\d+):)?(?:[0-5]?\d:)?(?:[0-5]?\d)$/;

  function convertToPrecice(e: ChangeEvent<HTMLInputElement>) {
    const time = e.currentTarget.value;

    const correctTimeFormat = nonPreciseTimeRegex.test(time);

    const preciseTime = correctTimeFormat ? findNextMultiple(e.currentTarget.value) : ALL_ZERO;

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

    const newCorrectFormat = correctFormat[boss.boss]
      ? [...correctFormat[boss.boss], { id: id, correct: false }]
      : [{ id: id, correct: false }];

    setCorrectFormat({
      ...correctFormat,
      [boss.boss]: newCorrectFormat
    });

    setleaderBoards({
      ...leaderBoards,
      [boss.boss]: { board: [...leaderBoards[boss.boss].board, newTime] }
    });
  }

  function handleRemove(id: number, boss: string, hardDelete?: boolean) {
    let i = leaderBoards[boss].board.findIndex(
      (speedEntry: SpeedsLeaderboardEntry) => speedEntry.id === id
    );
    if (i === -1) return;

    const tempBoard = [...leaderBoards[boss].board];
    if (hardDelete) {
      if (Number.isInteger(id)) {
        setDeletedTimes({ ...deletedTimes, [boss]: [...(deletedTimes[boss] ?? []), id] });
      }
      tempBoard.splice(i, 1);

      // Only delete from format check state when it's a permanent delete.
      const tempFormat = JSON.parse(JSON.stringify(correctFormat));
      if (tempFormat[boss]) {
        tempFormat[boss].filter((entry: { id: number; correct: boolean }) => entry.id !== id);
      }

      setCorrectFormat(tempFormat);
    } else {
      const updatedObject = Object.assign({}, leaderBoards[boss].board[i], {
        removed: leaderBoards[boss].board[i].removed ? 0 : 1
      });
      tempBoard[i] = updatedObject;
    }

    setleaderBoards({ ...leaderBoards, [boss]: { board: tempBoard } });
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const [id, boss, field] = e.currentTarget.name.split('/');
    const value = e.currentTarget.value;

    // Always check the format of the 'time' field
    const timeField = document.querySelector(`input[name="${id}/${boss}/time"]`) as HTMLInputElement;
    const timeValue = timeField ? timeField.value : '';

    let correct = false;
    if (timeRegex.test(timeValue)) {
      correct = true;
      timeField.style.color = 'white';
    } else {
      timeField.style.color = 'red';
    }

    const correctFormattedEntry: Record<string, { id: number; correct: boolean }[]> = JSON.parse(
      JSON.stringify(correctFormat)
    );
    if (correctFormattedEntry[boss]) {
      const toEdit = correctFormattedEntry[boss].find(entry => entry.id === Number(id));
      if (toEdit) {
        toEdit.correct = correct;
      } else {
        correctFormattedEntry[boss].push({ id: Number(id), correct: correct });
      }
    } else {
      correctFormattedEntry[boss] = [{ id: Number(id), correct: correct }];
    }

    setCorrectFormat(correctFormattedEntry);

    let updatedBoss = JSON.parse(JSON.stringify(leaderBoards[boss])) as {
      board: SpeedsLeaderboardEntry[];
    };

    updatedBoss.board = updatedBoss.board.map(entry => {
      return entry.id.toString() === id ? { ...entry, [field]: value } : entry;
    });

    setleaderBoards({ ...leaderBoards, [boss]: updatedBoss });
  }

  function updateBoardDifferences() {
    const newchangedLeaderboards: FetchedSpeedLeaderboard = {};

    Object.keys(leaderBoards).forEach(boss => {
      if (previousLeaderBoards[boss]) {
        const fetchedEntries = leaderBoards[boss].board;
        const previousEntries = previousLeaderBoards[boss].board;

        // Find entries in fethcedBoard but not in previousLeaderBoards, or changed.
        const changedEntries = fetchedEntries.filter(fetchedEntry => {
          const matchingPreviousEntry = previousEntries.find(prev => prev.id === fetchedEntry.id);

          return (
            !matchingPreviousEntry ||
            JSON.stringify(fetchedEntry) !== JSON.stringify(matchingPreviousEntry)
          );
        });

        // If there are any changed/additions
        if (changedEntries.length > 0) {
          newchangedLeaderboards[boss] = { board: changedEntries };
        }
      } else {
        // If it's a new added time
        newchangedLeaderboards[boss] = { board: [...leaderBoards[boss].board] };
      }
    });

    setchangedLeaderboards(newchangedLeaderboards);
  }

  useEffect(() => {
    if (Object.keys(leaderBoards).length > 0) {
      updateBoardDifferences();
    }
  }, [leaderBoards]);

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
          sendToast(data.message, ToastType.Success);
          return;
        }
      });
  }

  async function handleSave(boss: LeaderboardBoss) {
    if (
      correctFormat[boss.boss] &&
      Object.values(correctFormat[boss.boss]).some(value => value.correct === false)
    ) {
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
        body: JSON.stringify({
          changes: changedLeaderboards[boss.boss]?.board ?? [],
          deletions: deletedTimes[boss.boss] ?? []
        })
      }
    )
      .then(response => response.json())
      .then((data: { message: string; ids?: { oldId: number; newId: number }[] }) => {
        if (!data.message.toLowerCase().includes('success')) {
          sendToast(data.message, ToastType.Error);
          return;
        } else {
          sendToast(`Successfully saved the leaderboard for '${boss.boss}'`, ToastType.Success);

          const top3before = getTopThree(boss, previousLeaderBoards[boss.boss].board);
          const top3after = getTopThree(boss, leaderBoards[boss.boss].board);

          // Find differences for before and after the changes
          const updates = findDifferences(boss, top3before, top3after);
          if (updates) {
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
          }

          if (data.ids) {
            // New times were added. We need to replace old id with the new id in both
            // current board and the previous board so that we don't show any changes
            // happened.
            const tempLeaderboards = JSON.parse(JSON.stringify(leaderBoards));
            const savedBoard = tempLeaderboards[boss.boss].board;
            for (const idUpdate of data.ids) {
              savedBoard.forEach((entry: SpeedsLeaderboardEntry) => {
                if (entry.id === idUpdate.oldId) {
                  entry.id = idUpdate.newId;
                }
              });
            }
            setleaderBoards(tempLeaderboards);

            // Also set the previous leader board to match the current board
            // for the saved board so that there is no difference anymore.
            // With no difference between the two boards, we can safely remove
            // the board from the changedLeaderboards state. And disable the
            // save button for that board.
            setpreviousLeaderBoards({
              ...previousLeaderBoards,
              [boss.boss]: { board: [...savedBoard] }
            });

            setDeletedTimes({ ...deletedTimes, [boss.boss]: [] });
            setCorrectFormat({ ...correctFormat, [boss.boss]: [] });
          }
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

  async function getSpeedBoard(boss: LeaderboardBoss): Promise<void> {
    if (!leaderBoards.hasOwnProperty(boss.boss)) {
      const bossBoardUrl = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/uncle/dashboard/speedboard`;
      const token = getStorage('access_token');
      await fetch(`${bossBoardUrl}?accessToken=${token}&boss=${boss.boss}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then((data: SpeedsLeaderboardEntry[]) => {
          setleaderBoards({ ...leaderBoards, [boss.boss]: { board: data } });
          setpreviousLeaderBoards({ ...previousLeaderBoards, [boss.boss]: { board: data } });
        });
    }
  }

  return (
    <>
      <div className="wrap">
        <div className="configs">
          <input
            id="show-removed-times"
            type="checkbox"
            defaultChecked={showRemovedTimes}
            onChange={e => setShowRemovedTimes(e.currentTarget.checked)}
          />
          <label htmlFor="show-removed-times">Show removed times</label>
        </div>
        <div className="precise-time">
          <label htmlFor="precise-time-input">Time to Precise time</label>
          <input
            id="precise-time-input"
            type="text"
            autoComplete="off"
            placeholder="Time"
            onChange={e => convertToPrecice(e)}
          />
          <input id="precise-time-result" type="text" value={preciseTime} readOnly />
        </div>
        <Collapsible title="Board Changes">
          <button
            className="post-updates"
            onClick={handlePostChangelog}
            style={
              Object.keys(boardUpdates).length > 0
                ? {}
                : { pointerEvents: 'none', backgroundColor: '#444444' }
            }
          >
            <span>Post Changelog</span>
          </button>
          <EmbedPreview embed={{}} content={createUpdatesContent(boardUpdates)} />
        </Collapsible>
        {LeaderboardBosses.map(b => {
          return (
            <BossLine
              boss={b}
              data={leaderBoards[b.boss]?.board ?? []}
              saved={
                changedLeaderboards[b.boss] === undefined &&
                (deletedTimes[b.boss] === undefined || deletedTimes[b.boss].length === 0)
              }
              previewContent={buildBoardMessage(
                b,
                leaderBoards[b.boss]?.board.filter(e => !e.removed) ?? []
              )}
              showRemovedTimes={showRemovedTimes}
              key={b.boss}
              addTime={addTime}
              handleChange={handleChange}
              handleRemove={handleRemove}
              handleUpdate={handleUpdate}
              handleSave={handleSave}
              getSpeedBoard={getSpeedBoard}
            />
          );
        })}
      </div>
    </>
  );
}

function findDifferences(
  boss: LeaderboardBoss,
  previousTop3: BoardInterface[],
  currentTop3: BoardInterface[]
) {
  const updates: BoardUpdates = {};
  // No change for this boss
  if (areObjectsEqual(previousTop3, currentTop3)) return;

  if (!boss.categories) {
    updates[`${boss.emoji} ${boss.boss} ${boss.emoji}`] = getUpdates(previousTop3, currentTop3);
  } else {
    for (const category of boss.categories) {
      const categoryPreviousTop = previousTop3.filter(e => e.category === category);
      const categoryCurrentTop = currentTop3.filter(e => e.category === category);

      const { fellOff, newEntry, improved } = getUpdates(categoryPreviousTop, categoryCurrentTop);

      if (fellOff.length === 0 && newEntry.length === 0 && improved.length === 0) continue;
      updates[`${boss.emoji} ${boss.boss} ${boss.emoji}/${category}`] = {
        fellOff,
        newEntry,
        improved
      };
    }
  }

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
