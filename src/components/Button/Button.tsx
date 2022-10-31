import { MouseEventHandler } from 'react';
import './Button.css';

interface ButtonProps {
  text: string;
  handleClick: MouseEventHandler;
}

function Button({ text, handleClick }: ButtonProps) {
  return (
    <button onClick={handleClick} className="btn bold">
      {text}
    </button>
  );
}

export default Button;
