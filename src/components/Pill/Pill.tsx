import './Pill.css';

function Pill({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="pill">
      <img src={icon} alt="Guild Icon" title={label} />
    </div>
  );
}

export default Pill;
