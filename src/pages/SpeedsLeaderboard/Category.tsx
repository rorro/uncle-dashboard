import { ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { LeaderboardBoss, SpeedsLeaderboardEntry } from '../../types';
import TimeEntry from './TimeEntry';

interface IProps {
  boss: LeaderboardBoss;
  entries: SpeedsLeaderboardEntry[];
  showRemovedTimes: boolean;
  addTime: (boss: LeaderboardBoss, category: string | null) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRemove: (id: number, boss: string, hardDelete?: boolean) => void;
}

function Category({ boss, entries, showRemovedTimes, addTime, handleChange, handleRemove }: IProps) {
  return (
    <>
      {boss.categories?.map(c => {
        return (
          <div className="category" key={c}>
            <b>{c}</b>
            <br />
            {
              <>
                {entries
                  .filter(e => e.category === c)
                  .map(e => {
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
                <button id="new-player" className="speeds-add" onClick={e => addTime(boss, c)}>
                  ADD ENTRY
                  <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faPlusSquare} />
                </button>
                <br />
                {showRemovedTimes && (
                  <div style={{ backgroundColor: '#3f3636' }}>
                    {entries.filter(e => e.category === c && e.removed).length > 0 && 'Removed Times'}
                    {entries
                      .filter(e => e.category === c)
                      .map(e => {
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
                )}
              </>
            }
          </div>
        );
      })}
    </>
  );
}

export default Category;
