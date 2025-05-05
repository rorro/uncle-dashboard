import { ChangeEvent } from 'react';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LeaderboardBoss, SpeedsLeaderboardEntry } from '../../types';
import TimeEntry from './TimeEntry';
import Category from './Category';
import Collapsible from '../../components/Collapsible';
import EmbedPreview from '../../components/EmbedPreview';
import { APIEmbed } from 'discord.js';

interface IProps {
  boss: LeaderboardBoss;
  data: SpeedsLeaderboardEntry[];
  saved: boolean;
  previewContent: APIEmbed;
  showRemovedTimes: boolean;
  addTime: (boss: LeaderboardBoss, category: string | null) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRemove: (id: number, boss: string, hardDelete?: boolean) => void;
  handleUpdate: (boss: LeaderboardBoss) => void;
  handleSave: (boss: LeaderboardBoss) => void;
  getSpeedBoard: (boss: LeaderboardBoss) => void;
}

function BossLine({
  boss,
  data,
  saved,
  previewContent,
  showRemovedTimes,
  addTime,
  handleChange,
  handleRemove,
  handleUpdate,
  handleSave,
  getSpeedBoard
}: IProps) {
  return (
    <Collapsible title={`${boss.emoji} ${boss.boss}`} boss={boss} fetchOnOpen={getSpeedBoard}>
      <div className="boss-wrapper">
        <button
          className="save-boss"
          style={!saved ? {} : { pointerEvents: 'none', backgroundColor: '#444444' }}
          onClick={() => handleSave(boss)}
        >
          Save board
        </button>
        <button
          className="update-discord"
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
            {showRemovedTimes && (
              <div style={{ backgroundColor: '#3f3636' }}>
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
            )}
          </div>
        ) : (
          <Category
            boss={boss}
            entries={data}
            key={boss.boss}
            showRemovedTimes={showRemovedTimes}
            addTime={addTime}
            handleChange={handleChange}
            handleRemove={handleRemove}
          />
        )}
      </div>
      <div className="speed-preview">
        <EmbedPreview embed={previewContent} content={''} />
      </div>
    </Collapsible>
  );
}

export default BossLine;
