import React, { useState } from 'react';
import './Collapsible.css';

interface IProps {
  title: string;
  id?: number;
  date?: string;
  channel?: string;
  children?: React.ReactNode;
}
function Collapsible({ id, title, date, channel, children }: IProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleFilterOpening = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="card">
      <div className="card_header" onClick={handleFilterOpening}>
        <span>{title}</span>
        {id && <span className="info">ID: {id.toString()}</span>}
        {date && <span className="info">Date: {date}</span>}
        {channel && <span className="info">Channel: #{channel}</span>}

        <span className="arrow">{isOpen ? '⯅' : '⯆'}</span>
      </div>

      {isOpen && <div className="card_content">{children}</div>}
    </div>
  );
}

export default Collapsible;
