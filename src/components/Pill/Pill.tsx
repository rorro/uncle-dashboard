import './Pill.css';

function Pill({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="pill">
      <img src={icon} alt="Guild Icon" />
      <p>{label}</p>
    </div>
  );
}

export default Pill;
