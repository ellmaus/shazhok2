interface ToggleProps {
  on: boolean;
  onToggle: () => void;
  label?: string;
}

export default function Toggle({ on, onToggle, label }: ToggleProps) {
  return (
    <button
      type="button"
      className={`toggle${on ? ' on' : ''}`}
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      aria-label={label}
    >
      <span className="knob" />
    </button>
  );
}
