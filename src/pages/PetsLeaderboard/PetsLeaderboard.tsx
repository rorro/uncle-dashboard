import { ChangeEvent, useEffect, useState } from 'react';
import { PetLeaderboardEntry, ToastType } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import './PetsLeaderboard.css';
import PetsHeader from './PetsHeader';
import PetList from './PetList';
import { defaultPetLeaderboardEntry } from '../../utils/defaults';
import { getStorage } from '../../utils/storage';
import sendToast from '../../utils/toast';
import Pets from '../../pets';

function PetsLeaderboard({ petsLeaderboard }: { petsLeaderboard: PetLeaderboardEntry[] }) {
  const [leaderboard, setLeaderboard] = useState<PetLeaderboardEntry[]>(petsLeaderboard);
  const [previousLeaderboard, setPreviousLeaderboard] = useState<PetLeaderboardEntry[]>(petsLeaderboard);
  const [boardChanged, setboardChanged] = useState<boolean>(false);
  const removedPets = leaderboard.filter(p => p.removed);

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

  function handleRemovePlayer(playerId: number, hardDelete: boolean) {
    let i = leaderboard.findIndex((player: PetLeaderboardEntry) => player.id === playerId);
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

  async function handleUpdate() {
    const token = getStorage('access_token');

    const payload = {
      access_token: token,
      category: 'pets'
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

  useEffect(() => {
    const changed = JSON.stringify(leaderboard) !== JSON.stringify(previousLeaderboard);

    setboardChanged(changed);
  }, [leaderboard, previousLeaderboard]);

  return (
    <div className="wrap">
      <div className="buttons">
        <button
          className="save-pets flex-start"
          onClick={handleSave}
          style={boardChanged ? {} : { pointerEvents: 'none', backgroundColor: '#444444' }}
        >
          <span>Save</span>
        </button>
        <button
          className="update-discord flex-start"
          onClick={handleUpdate}
          style={!boardChanged ? {} : { pointerEvents: 'none', backgroundColor: '#444444' }}
        >
          <span>Update Discord</span>
        </button>
        <button id="new-player" className="flex-end" onClick={handleAddPlayer}>
          ADD PLAYER
          <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faPlusSquare} />
        </button>
      </div>
      <div className="leaderboard-wrap">
        <table className="pets-leaderboard">
          <PetsHeader pets={Pets} />
          <PetList
            leaderboard={leaderboard.filter(p => !p.removed)}
            handleChange={handleChange}
            handleRemove={handleRemovePlayer}
          />
        </table>
      </div>

      {removedPets.length > 0 && (
        <>
          <label>Removed Pets</label>
          <div className="leaderboard-wrap">
            <table className="pets-leaderboard">
              <PetsHeader pets={Pets} />
              <PetList
                leaderboard={removedPets}
                handleChange={handleChange}
                handleRemove={handleRemovePlayer}
              />
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default PetsLeaderboard;
