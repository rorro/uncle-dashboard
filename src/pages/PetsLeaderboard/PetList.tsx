import { ChangeEvent } from 'react';
import { PetLeaderboardEntry } from '../../types';
import PetRow from './PetRow';

interface IProps {
  leaderboard: PetLeaderboardEntry[];
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRemove: (playerId: number, hardDelete: boolean) => void;
}

function PetList({ leaderboard, handleChange, handleRemove }: IProps) {
  return (
    <>
      <tbody id="player-list">
        {leaderboard.map(player => {
          return (
            <PetRow
              key={player.id}
              player={player}
              handleChange={handleChange}
              handleRemove={handleRemove}
            />
          );
        })}
      </tbody>
    </>
  );
}

export default PetList;
