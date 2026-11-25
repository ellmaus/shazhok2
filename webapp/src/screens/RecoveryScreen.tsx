import { useShazhok, toDisplay } from '../store';
import ScenarioCard from '../components/ScenarioCard';
import { scenariosByCategory } from '../data/scenarios';

interface RecoveryScreenProps {
  onClose: () => void;
  onOpenScenario: (id: string) => void;
}

export default function RecoveryScreen({ onClose, onOpenScenario }: RecoveryScreenProps) {
  const favorites = useShazhok((s) => s.favoriteScenarioIds);
  const toggleFavorite = useShazhok((s) => s.toggleFavorite);

  const scenarios = scenariosByCategory('recover');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="screen-head">
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть">
            ←
          </button>
          <h1>Мне нужно восстановиться</h1>
        </div>

        <p className="hint" style={{ marginTop: 0 }}>
          Здесь нет уборки и задач. Просто маленькие действия, которые могут
          облегчить состояние. Это повседневная самоподдержка, а не лечение.
        </p>

        <div className="scenario-list">
          {scenarios.map((s) => (
            <ScenarioCard
              key={s.id}
              scenario={toDisplay(s)}
              isFavorite={favorites.includes(s.id)}
              onOpen={() => onOpenScenario(s.id)}
              onToggleFavorite={() => toggleFavorite(s.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
