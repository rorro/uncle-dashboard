import { ChangeEvent, useEffect, useState } from 'react';
import { PetEntry, PetLeaderboardEntry, ToastType } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import './PetsLeaderboard.css';
import PetsHeader from './PetsHeader';
import PetList from './PetList';
import { defaultPetLeaderboardEntry } from '../../utils/defaults';
import { getStorage } from '../../utils/storage';
import sendToast from '../../utils/toast';

function PetsLeaderboard({
  pets,
  petsLeaderboard
}: {
  pets: PetEntry[];
  petsLeaderboard: PetLeaderboardEntry[];
}) {
  const [leaderboard, setLeaderboard] = useState<PetLeaderboardEntry[]>(petsLeaderboard);
  const [previousLeaderboard, setPreviousLeaderboard] = useState<PetLeaderboardEntry[]>(petsLeaderboard);
  const [boardChanged, setboardChanged] = useState<boolean>(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const [id, metric] = e.currentTarget.name.split(':');
    const value =
      metric !== 'username'
        ? (e as ChangeEvent<HTMLInputElement>).currentTarget.checked
          ? 1
          : 0
        : e.currentTarget.value;

    let i = leaderboard.findIndex((player: PetLeaderboardEntry) => player.id.toString() === id);
    if (i === -1) return;

    const updatedObject = Object.assign({}, leaderboard[i], { [metric]: value });
    const tempBoard = [...leaderboard];
    tempBoard[i] = updatedObject;

    setLeaderboard(tempBoard);
  }

  function handleAddPlayer() {
    const newPlayer: PetLeaderboardEntry = {
      id: Math.random(),
      ...defaultPetLeaderboardEntry
    };

    setLeaderboard([...leaderboard, newPlayer]);
  }

  function handleRemovePlayer(playerId: number) {
    let i = leaderboard.findIndex((player: PetLeaderboardEntry) => player.id === playerId);
    if (i === -1) return;

    const tempBoard = [...leaderboard];
    tempBoard.splice(i, 1);

    setLeaderboard(tempBoard);
  }

  async function handleSave() {
    const token = getStorage('access_token');

    await fetch(
      `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/uncle/dashboard/savedata?accessToken=${token}&category=pets`,
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
    <div className="wrap">
      <button id="new-player" onClick={handleAddPlayer}>
        ADD PLAYER
        <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faPlusSquare} />
      </button>
      <button
        className="save-pets"
        onClick={handleSave}
        style={boardChanged ? {} : { pointerEvents: 'none', backgroundColor: '#444444' }}
      >
        <span>Save</span>
      </button>
      <div className="leaderboard-wrap">
        <table id="pets-leaderboard">
          <PetsHeader pets={pets} />
          <PetList leaderboard={leaderboard} onChange={handleChange} onRemove={handleRemovePlayer} />
        </table>
      </div>
    </div>
  );
}

export default PetsLeaderboard;
