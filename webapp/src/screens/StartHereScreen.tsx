import { START_HERE_OPTIONS } from '../data/scenarios';

interface StartHereScreenProps {
  onClose: () => void;
  onOpenScenario: (id: string) => void;
}

export default function StartHereScreen({ onClose, onOpenScenario }: StartHereScreenProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="screen-head">
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть">
            ←
          </button>
          <h1>Не знаю, с чего начать</h1>
        </div>

        <p className="hint" style={{ marginTop: 0 }}>
          Что сейчас беспокоит больше всего? Подберём одно маленькое действие.
        </p>

        <div className="option-list">
          {START_HERE_OPTIONS.map((o) => (
            <button
              key={o.id}
              className="option-btn"
              onClick={() => onOpenScenario(o.scenarioId)}
            >
              <span className="o-emoji">{o.emoji}</span>
              <span>{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
