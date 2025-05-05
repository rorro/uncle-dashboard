import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SpeedsLeaderboardEntry } from '../../types';
import { faPlusSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ChangeEvent, useEffect, useRef } from 'react';

interface IProps {
  entry: SpeedsLeaderboardEntry;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRemove: (id: number, boss: string, hardDelete?: boolean) => void;
}

function TimeEntry({ entry, handleChange, handleRemove }: IProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [entry.username]);

  function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    handleChange(e);
  }

  return (
    <div>
      {entry.removed ? (
        <button id="readd-player" onClick={e => handleRemove(entry.id, entry.boss, false)}>
          <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faPlusSquare} />
        </button>
      ) : (
        ''
      )}

      <button
        id="remove-player"
        onClick={e =>
          entry.removed
            ? handleRemove(entry.id, entry.boss, true)
            : handleRemove(entry.id, entry.boss, false)
        }
      >
        <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faTrash} />
      </button>

      <textarea
        ref={textareaRef}
        className="speed-username"
        autoComplete="off"
        defaultValue={entry.username}
        placeholder="Username"
        name={`${entry.id}/${entry.boss}/username`}
        onChange={e => handleInput(e)}
        rows={1}
      />
      <input
        className="speed-time"
        type="text"
        autoComplete="off"
        defaultValue={entry.time}
        placeholder="Time"
        name={`${entry.id}/${entry.boss}/time`}
        onChange={e => handleChange(e)}
      />
      <input
        className="speed-proof"
        type="text"
        autoComplete="off"
        defaultValue={entry.proof ? entry.proof : ''}
        placeholder="Proof"
        name={`${entry.id}/${entry.boss}/proof`}
        onChange={e => handleChange(e)}
      />
    </div>
  );
}

export default TimeEntry;
