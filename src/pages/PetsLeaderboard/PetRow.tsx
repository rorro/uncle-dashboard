import { ChangeEvent } from 'react';
import { PetLeaderboardEntry } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

interface IProps {
  player: PetLeaderboardEntry;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRemove: (playerId: number, hardDelete: boolean) => void;
}

function PetRow({ player, handleChange, handleRemove }: IProps) {
  return (
    <tr key={player.id} className="pet-list">
      {Object.keys(player).map(k => {
        const kType = k as keyof PetLeaderboardEntry;
        if (kType === 'id' || kType === 'removed') return '';
        return (
          <td className="pet-entry" key={k}>
            {kType === 'username' ? (
              <>
                {player.removed ? (
                  <button id="readd-player" onClick={e => handleRemove(player.id, false)}>
                    <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faPlusSquare} />
                  </button>
                ) : (
                  ''
                )}
                <button
                  id="remove-player"
                  onClick={e =>
                    player.removed ? handleRemove(player.id, true) : handleRemove(player.id, false)
                  }
                >
                  <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faTrash} />
                </button>
                <input
                  type="text"
                  className="input username"
                  value={player.username}
                  placeholder={'Username'}
                  name={`${player.id}:username`}
                  maxLength={12}
                  onChange={e => handleChange(e)}
                />
                <label htmlFor={`${player.id}:username`}>
                  {
                    Object.entries(player).filter(
                      ([key, val]) => key !== 'id' && key !== 'removed' && val === 1
                    ).length
                  }
                </label>
              </>
            ) : (
              <input
                type="checkbox"
                className="checkbox"
                name={`${player.id}:${k}`}
                defaultChecked={!!player[kType]}
                onChange={e => handleChange(e)}
              />
            )}
          </td>
        );
      })}
    </tr>
  );
}

export default PetRow;
