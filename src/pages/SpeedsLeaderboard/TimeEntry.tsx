import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SpeedsLeaderboardEntry } from '../../types';
import { faPlusSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ChangeEvent } from 'react';

interface IProps {
  entry: SpeedsLeaderboardEntry;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRemove: (id: number, hardDelete: boolean) => void;
}

function TimeEntry({ entry, handleChange, handleRemove }: IProps) {
  return (
    <div>
      {entry.removed ? (
        <button id="readd-player" onClick={e => handleRemove(entry.id, false)}>
          <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faPlusSquare} />
        </button>
      ) : (
        ''
      )}

      <button
        id="remove-player"
        onClick={e => (entry.removed ? handleRemove(entry.id, true) : handleRemove(entry.id, false))}
      >
        <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faTrash} />
      </button>

      <input
        className="speed-username"
        type="text"
        autoComplete="off"
        defaultValue={entry.username}
        placeholder="Username"
        name={`${entry.id}:username`}
        onChange={e => handleChange(e)}
      />
      <input
        className="speed-time"
        type="text"
        autoComplete="off"
        defaultValue={entry.time}
        placeholder="Time"
        name={`${entry.id}:time`}
        onChange={e => handleChange(e)}
      />
      <input
        className="speed-proof"
        type="text"
        autoComplete="off"
        defaultValue={entry.proof ? entry.proof : ''}
        placeholder="Proof"
        name={`${entry.id}:proof`}
        onChange={e => handleChange(e)}
      />
    </div>
  );
}

export default TimeEntry;
