import parse from 'html-react-parser';
import React, { useState } from 'react';
import { markup } from '../../helpers/formatting';
import './Collapsible.css';
import { LeaderboardBoss } from '../../types';

interface IProps {
  title: string;
  id?: number;
  date?: string;
  channel?: string;
  boss?: LeaderboardBoss;
  children?: React.ReactNode;
  fetchOnOpen?: (boss: LeaderboardBoss) => void;
}
function Collapsible({ id, title, date, channel, boss, children, fetchOnOpen }: IProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const handleFilterOpening = (boss?: LeaderboardBoss) => {
    setIsOpen(prev => !prev);

    if (fetchOnOpen && !isOpen && boss && !hasFetched) {
      fetchOnOpen(boss);
      setHasFetched(true);
    }
  };

  const isHeader = (): boolean => {
    return !!date && !!channel;
  };

  const isFields = (): boolean => {
    return !!id && !date && !channel;
  };

  return (
    <div className="card">
      <div className="card_header" onClick={() => handleFilterOpening(boss)}>
        <span title={title}>{parse(markup(title, { replaceEmojis: true }))}</span>
        {isHeader() && <span className="info">ID: {id}</span>}
        {isHeader() && <span className="info">Date: {date}</span>}
        {isHeader() && <span className="info">Channel: #{channel}</span>}

        <span className="arrow">{isOpen ? '⯅' : '⯆'}</span>
      </div>

      {isOpen &&
        (isFields() ? (
          <div className="card_content" id={`${id}`}>
            {children}
          </div>
        ) : (
          <div className="card_content">{children}</div>
        ))}
    </div>
  );
}

export default Collapsible;
