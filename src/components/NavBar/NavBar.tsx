import './NavBar.css';
import Button from '../Button';
import { NavBarProps } from '../../types';

function NavBar(props: NavBarProps) {
  const { icon, title, button } = props;
  const { label, handleClick } = button;

  return (
    <header className="header">
      <div className="title">
        <img className="header_icon" src={icon} alt="Uncle" />
        <div className="title_text">{title}</div>
      </div>
      <Button text={label} handleClick={handleClick} />
    </header>
  );
}

export default NavBar;
