import { useShazhok, winsLastDays } from '../store';
import { categoryById } from '../data/categories';
import { plural, formatRelative } from '../utils';

export default function WinsScreen() {
  const wins = useShazhok((s) => s.wins);

  const weekWins = winsLastDays(wins, 7);
  const total = weekWins.length;

  const byCategory = new Map<string, number>();
  for (const w of weekWins) {
    byCategory.set(w.categoryId, (byCategory.get(w.categoryId) ?? 0) + 1);
  }
  const topCategories = [...byCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const recent = wins.slice(0, 20);

  return (
    <div>
      <header className="screen-head">
        <h1>🌱 Мои успехи</h1>
      </header>

      <div className="wins-total">
        <div className="n">{total}</div>
        <div className="cap">
          {plural(total, 'действие', 'действия', 'действий')} за последние 7 дней
        </div>
      </div>

      {topCategories.length > 0 ? (
        <div className="card" style={{ marginBottom: 16 }}>
          {topCategories.map(([catId, count]) => {
            const cat = categoryById(catId);
            return (
              <div key={catId} className="win-row">
                <span className="w-emoji">{cat.emoji}</span>
                <span className="w-body">
                  <span className="w-title">{cat.name}</span>
                </span>
                <span className="w-count">
                  {count} {plural(count, 'действие', 'действия', 'действий')}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}

      <p className="wins-note">
        Это не оценка твоей продуктивности. Просто напоминание о том, что ты
        уже сделал(а).
      </p>

      <div className="section-title">Недавние шаги</div>
      {recent.length === 0 ? (
        <div className="empty-state">
          <div className="big">🌱</div>
          <p>Здесь появятся твои маленькие победы. Начни с одного шага.</p>
        </div>
      ) : (
        <div className="card">
          {recent.map((w) => {
            const cat = categoryById(w.categoryId);
            return (
              <div key={w.id} className="win-row">
                <span className="w-emoji">{w.emoji}</span>
                <span className="w-body">
                  <span className="w-title">{w.title}</span>
                  <span className="w-meta">
                    {cat.name} · {w.stepsDone}/{w.stepsTotal} шагов ·{' '}
                    {formatRelative(w.completedAt.slice(0, 10))}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
