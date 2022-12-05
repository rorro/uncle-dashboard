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

  const isHeader = (): boolean => {
    return !!date && !!channel;
  };

  const isFields = (): boolean => {
    return !!id && !date && !channel;
  };

  return (
    <div className="card">
      <div className="card_header" onClick={handleFilterOpening}>
        <span title={title}>{title}</span>
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
