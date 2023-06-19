import { ChangeEvent } from 'react';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LeaderboardBoss, SpeedsLeaderboardEntry } from '../../types';
import TimeEntry from './TimeEntry';
import Category from './Category';
import Collapsible from '../../components/Collapsible';

interface IProps {
  boss: LeaderboardBoss;
  data: SpeedsLeaderboardEntry[];
  saved: boolean;
  addTime: (boss: LeaderboardBoss, category: string | null) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRemove: (id: number, hardDelete: boolean) => void;
  handleUpdate: (boss: LeaderboardBoss) => void;
}

function BossLine({ boss, data, saved, addTime, handleChange, handleRemove, handleUpdate }: IProps) {
  return (
    <Collapsible title={`${boss.emoji} ${boss.boss}`}>
      <div className="boss-wrapper">
        <button
          className="update-boss"
          style={saved ? {} : { pointerEvents: 'none', backgroundColor: '#444444' }}
          onClick={e => handleUpdate(boss)}
        >
          Update Discord Message
        </button>
        {!boss.categories ? (
          <div className="no-category">
            {data.map(e => {
              return (
                !e.removed && (
                  <TimeEntry
                    entry={e}
                    key={e.id}
                    handleChange={handleChange}
                    handleRemove={handleRemove}
                  />
                )
              );
            })}
            <button id="new-player" className="speeds-add" onClick={e => addTime(boss, null)}>
              ADD ENTRY
              <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faPlusSquare} />
            </button>
            <br />
            {data.filter(e => e.removed).length > 0 && 'Removed Times'}
            {data.map(e => {
              return (
                !!e.removed && (
                  <TimeEntry
                    entry={e}
                    key={e.id}
                    handleChange={handleChange}
                    handleRemove={handleRemove}
                  />
                )
              );
            })}
          </div>
        ) : (
          <Category
            boss={boss}
            entries={data}
            key={boss.boss}
            addTime={addTime}
            handleChange={handleChange}
            handleRemove={handleRemove}
          />
        )}
      </div>
    </Collapsible>
  );
}

export default BossLine;
