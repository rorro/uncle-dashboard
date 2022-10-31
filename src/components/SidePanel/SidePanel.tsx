import SidePanelOption from '../SidePanelOption';
import './SidePanel.css';

const opts = ['Messages', 'Channels', 'Config', 'Open Applications', 'Open Support Tickets'];

function SidePanel() {
  return (
    <div className="sidebar">
      <p>Configurations</p>
      <ul className="sidebar_list">
        {opts.map((o, i) => (
          <SidePanelOption label={o} key={i} />
        ))}
      </ul>
    </div>
  );
}

export default SidePanel;
