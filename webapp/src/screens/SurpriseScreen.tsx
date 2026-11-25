import { useState } from 'react';
import { useShazhok } from '../store';
import { surpriseMe } from '../data/scenarios';
import { energyById } from '../data/energy';
import { categoryById } from '../data/categories';
import type { EnergyLevel } from '../types';

interface SurpriseScreenProps {
  onClose: () => void;
  onOpenScenario: (id: string) => void;
}

export default function SurpriseScreen({ onClose, onOpenScenario }: SurpriseScreenProps) {
  const energy = useShazhok((s) => s.energy);
  const [scenario, setScenario] = useState(() => surpriseMe(energy ?? 'medium'));
  const [nonce, setNonce] = useState(0);

  const reroll = () => {
    setScenario(surpriseMe(energy ?? 'medium'));
    setNonce((n) => n + 1);
  };

  const e = energyById(scenario.energy as EnergyLevel);
  const cat = categoryById(scenario.categoryId);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="screen-head">
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть">
            ←
          </button>
          <h1>Вот что предлагаю</h1>
        </div>

        <p className="hint" style={{ marginTop: 0 }}>
          Одно посильное действие. Не обязательно делать больше.
        </p>

        <div className="card" style={{ margin: '12px 0 18px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>{scenario.emoji}</div>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 6 }}>
            {scenario.title}
          </div>
          <div className="hint">{scenario.description}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <span className="chip-energy">{cat.emoji} {cat.name}</span>
            <span className={`chip-energy ${scenario.energy}`}>{e.emoji} {e.title}</span>
            <span className="chip-energy">⏱ {scenario.minutes}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn primary" onClick={() => onOpenScenario(scenario.id)}>
            Начать
          </button>
          <button className="btn secondary" onClick={reroll}>
            🔄 Другое предложение {nonce > 0 ? `(${nonce})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
