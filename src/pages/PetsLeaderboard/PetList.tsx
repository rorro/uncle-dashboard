import { ChangeEvent } from 'react';
import { PetLeaderboardEntry } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface IProps {
  leaderboard: PetLeaderboardEntry[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (playerId: number) => void;
}

function PetList({ leaderboard, onChange, onRemove }: IProps) {
  return (
    <tbody id="player-list">
      {leaderboard.map(player => {
        return (
          <tr key={player.id} className="pet-list">
            {Object.keys(player).map(k => {
              const kType = k as keyof PetLeaderboardEntry;
              if (kType === 'id') return '';
              return (
                <td className="pet-entry" key={k}>
                  {kType === 'username' ? (
                    <>
                      <button id="remove-player" onClick={e => onRemove(player.id)}>
                        <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faTrash} />
                      </button>
                      <input
                        type="text"
                        className="input username"
                        value={player.username}
                        placeholder={'Username'}
                        name={`${player.id}:username`}
                        maxLength={12}
                        onChange={e => onChange(e)}
                      />
                      <label htmlFor={`${player.id}:username`}>
                        {Object.entries(player).filter(([key, val]) => key !== 'id' && val === 1).length}
                      </label>
                    </>
                  ) : (
                    <input
                      type="checkbox"
                      className="checkbox"
                      name={`${player.id}:${k}`}
                      defaultChecked={!!player[k as keyof PetLeaderboardEntry]}
                      onChange={e => onChange(e)}
                    />
                  )}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}

export default PetList;
