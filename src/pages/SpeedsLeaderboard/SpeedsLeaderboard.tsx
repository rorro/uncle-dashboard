import { ChangeEvent, useEffect, useState } from 'react';
import { LeaderboardBoss, SpeedsLeaderboardEntry, ToastType } from '../../types';
import './SpeedsLeaderboard.css';
import LeaderboardBosses from '../../leaderboardBosses';
import BossLine from './BossLine';
import { getStorage } from '../../utils/storage';
import sendToast from '../../utils/toast';
import { findNextMultiple } from '../../utils/preciseTimes';
import { buildBoardMessage } from '../../utils/topThreeLeaderboard';

function SpeedsLeaderboard({ speedsLeaderboard }: { speedsLeaderboard: SpeedsLeaderboardEntry[] }) {
  const ALL_ZERO = '00:00:00.00';

  const [leaderboard, setLeaderboard] = useState<SpeedsLeaderboardEntry[]>(speedsLeaderboard);
  const [previousLeaderboard, setPreviousLeaderboard] =
    useState<SpeedsLeaderboardEntry[]>(speedsLeaderboard);
  const [boardChanged, setboardChanged] = useState<boolean>(false);
  const [correctFormat, setCorrectFormat] = useState<Record<number, boolean>>({});
  const [preciseTime, setPreciseTime] = useState<string>(ALL_ZERO);

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
          setPreviousLeaderboard(leaderboard);
          sendToast(data.message, ToastType.Success);
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
        <button
          className="save-speeds"
          onClick={handleSave}
          style={boardChanged ? {} : { pointerEvents: 'none', backgroundColor: '#444444' }}
        >
          <span>Save</span>
        </button>
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

export default SpeedsLeaderboard;
