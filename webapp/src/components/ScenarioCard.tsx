import type { DisplayScenario } from '../store';
import { energyById } from '../data/energy';
import { categoryById } from '../data/categories';

interface ScenarioCardProps {
  scenario: DisplayScenario;
  isFavorite: boolean;
  onOpen: () => void;
  onToggleFavorite: () => void;
}

export default function ScenarioCard({
  scenario,
  isFavorite,
  onOpen,
  onToggleFavorite,
}: ScenarioCardProps) {
  const energy = energyById(scenario.energy);
  const cat = categoryById(scenario.categoryId);

  return (
    <div className="scenario-card" onClick={onOpen} role="button" tabIndex={0}>
      <span className="sc-emoji">{scenario.emoji}</span>
      <div className="sc-body">
        <div className="sc-title">{scenario.title}</div>
        {scenario.description ? (
          <div className="sc-desc">{scenario.description}</div>
        ) : null}
        <div className="sc-meta">
          <span className="chip">{cat.emoji} {cat.name}</span>
          <span className="chip energy">{energy.emoji} {energy.title}</span>
          <span className="chip">⏱ {scenario.minutes}</span>
          {isFavorite ? <span className="chip fav">★ в избранном</span> : null}
        </div>
      </div>
      <button
        className={`sc-fav-btn${isFavorite ? ' on' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
      >
        {isFavorite ? '★' : '☆'}
      </button>
    </div>
  );
}
