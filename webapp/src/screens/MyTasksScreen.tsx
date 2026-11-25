import { useShazhok, customToDisplay, toDisplay } from '../store';
import ScenarioCard from '../components/ScenarioCard';
import { scenarioById } from '../data/scenarios';

interface MyTasksScreenProps {
  onOpenScenario: (id: string) => void;
  onCreate: () => void;
}

export default function MyTasksScreen({ onOpenScenario, onCreate }: MyTasksScreenProps) {
  const favorites = useShazhok((s) => s.favoriteScenarioIds);
  const custom = useShazhok((s) => s.customScenarios);
  const toggleFavorite = useShazhok((s) => s.toggleFavorite);
  const deleteCustom = useShazhok((s) => s.deleteCustomScenario);

  const favScenarios = favorites
    .map((id) => scenarioById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div>
      <header className="screen-head">
        <h1>📝 Мои задачи</h1>
      </header>

      <p className="hint" style={{ marginTop: -8, marginBottom: 16 }}>
        Свои сценарии и сохранённые инструкции. Всё под рукой — без лишнего.
      </p>

      <button className="btn primary" onClick={onCreate}>
        ＋ Создать свою задачу
      </button>

      <div className="section-title">Сохранённые сценарии</div>
      {favScenarios.length === 0 ? (
        <div className="empty-state">
          <div className="big">⭐</div>
          <p>Пока пусто. Отмечай звёздочкой полезные сценарии в библиотеке.</p>
        </div>
      ) : (
        <div className="scenario-list">
          {favScenarios.map((s) => (
            <ScenarioCard
              key={s.id}
              scenario={toDisplay(s)}
              isFavorite
              onOpen={() => onOpenScenario(s.id)}
              onToggleFavorite={() => toggleFavorite(s.id)}
            />
          ))}
        </div>
      )}

      <div className="section-title">Мои сценарии</div>
      {custom.length === 0 ? (
        <div className="empty-state">
          <div className="big">🌱</div>
          <p>Создай собственную задачу — приложение поможет разбить её на шаги.</p>
        </div>
      ) : (
        <div className="scenario-list">
          {custom.map((c) => (
            <div key={c.id} style={{ position: 'relative' }}>
              <ScenarioCard
                scenario={customToDisplay(c)}
                isFavorite={false}
                onOpen={() => onOpenScenario(c.id)}
                onToggleFavorite={() => {}}
              />
              <button
                className="icon-btn"
                onClick={() => deleteCustom(c.id)}
                aria-label="Удалить"
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 32,
                  height: 32,
                  fontSize: 14,
                  background: 'var(--panel)',
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
