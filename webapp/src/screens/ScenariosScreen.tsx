import { useShazhok, toDisplay } from '../store';
import ScenarioCard from '../components/ScenarioCard';
import { CATEGORIES, categoryById } from '../data/categories';
import { scenariosByCategory, scenariosForEnergy, pickForMe, RANK_ENERGY } from '../data/scenarios';
import { energyById } from '../data/energy';

interface ScenariosScreenProps {
  categoryId: string;
  onCategoryChange: (id: string) => void;
  onOpenScenario: (id: string) => void;
}

export default function ScenariosScreen({
  categoryId,
  onCategoryChange,
  onOpenScenario,
}: ScenariosScreenProps) {
  const energy = useShazhok((s) => s.energy);
  const favorites = useShazhok((s) => s.favoriteScenarioIds);
  const toggleFavorite = useShazhok((s) => s.toggleFavorite);

  const cat = categoryById(categoryId);

  const scenarios = energy
    ? scenariosForEnergy(categoryId, energy)
    : scenariosByCategory(categoryId).sort(
        (a, b) => RANK_ENERGY[a.energy] - RANK_ENERGY[b.energy]
      );

  const surprise = () => {
    const s = pickForMe(categoryId, energy ?? 'medium');
    onOpenScenario(s.id);
  };

  return (
    <div>
      <header className="screen-head">
        <h1>📚 Сценарии</h1>
      </header>

      <div className="category-tabs">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`category-tab${c.id === categoryId ? ' active' : ''}`}
            onClick={() => onCategoryChange(c.id)}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      <div className="section-title">
        {cat.emoji} {cat.name} · {cat.subtitle}
      </div>

      {energy ? (
        <p className="hint" style={{ margin: '0 2px 12px', fontSize: '0.85rem' }}>
          {energyById(energy).emoji} Подборка под уровень «{energyById(energy).title}».
          Сначала — подходящее, ниже — варианты полегче.
        </p>
      ) : (
        <p className="hint" style={{ margin: '0 2px 12px', fontSize: '0.85rem' }}>
          Выбери уровень энергии на главной — подбор станет точнее. Пока показываем всё.
        </p>
      )}

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

      <button className="btn ghost" style={{ marginTop: 16 }} onClick={surprise}>
        ✨ Выбери за меня в этой категории
      </button>
    </div>
  );
}
