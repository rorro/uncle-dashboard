import { MouseEventHandler } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { MenuOptionProp } from '../../types';
import './SidePanel.css';

function SidePanel({
  menuItems,
  handleClick
}: {
  menuItems: MenuOptionProp[];
  handleClick: MouseEventHandler;
}) {
  return (
    <Menu width={150}>
      {menuItems.map(item => {
        return (
          <button value={item.key} key={item.key} className="menu-item" onClick={handleClick}>
            {item.value}
          </button>
        );
      })}
    </Menu>
  );
}

export default SidePanel;
