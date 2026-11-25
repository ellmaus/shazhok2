import type { EnergyLevel } from '../types';
import { ENERGY_LEVELS } from '../data/energy';

export type EnergyChoice = EnergyLevel | 'unknown';

interface EnergyPickerProps {
  value: EnergyChoice;
  onChange: (e: EnergyChoice) => void;
}

/** Выбор уровня энергии: три состояния + «Не знаю». */
export default function EnergyPicker({ value, onChange }: EnergyPickerProps) {
  return (
    <div className="energy-grid">
      {ENERGY_LEVELS.map((e) => (
        <button
          key={e.id}
          className={`energy-card${value === e.id ? ' selected' : ''}`}
          data-energy={e.id}
          onClick={() => onChange(e.id)}
          aria-pressed={value === e.id}
        >
          <span className="e-emoji">{e.emoji}</span>
          <span className="e-title">{e.title}</span>
          <span className="e-tagline">{e.tagline}</span>
        </button>
      ))}
      <button
        className={`energy-card${value === 'unknown' ? ' selected' : ''}`}
        data-energy="unknown"
        onClick={() => onChange('unknown')}
        aria-pressed={value === 'unknown'}
      >
        <span className="e-emoji">🌫️</span>
        <span className="e-title">Не знаю</span>
        <span className="e-tagline">Помоги определиться</span>
      </button>
    </div>
  );
}
