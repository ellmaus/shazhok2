import { useShazhok } from '../store';
import EnergyPicker, { type EnergyChoice } from '../components/EnergyPicker';
import { CATEGORIES } from '../data/categories';
import type { EnergyLevel } from '../types';

interface HomeScreenProps {
  onOpenCategory: (categoryId: string) => void;
  onSurprise: () => void;
  onStartHere: () => void;
  onRecover: () => void;
}

export default function HomeScreen({
  onOpenCategory,
  onSurprise,
  onStartHere,
  onRecover,
}: HomeScreenProps) {
  const name = useShazhok((s) => s.name);
  const energy = useShazhok((s) => s.energy);
  const setEnergy = useShazhok((s) => s.setEnergy);

  const handleEnergy = (choice: EnergyChoice) => {
    if (choice === 'unknown') {
      onStartHere();
      return;
    }
    setEnergy(choice as EnergyLevel);
  };

  return (
    <div>
      <header className="screen-head">
        <h1>Привет{name ? `, ${name}` : ''}! 👋</h1>
      </header>

      <p className="hint" style={{ marginTop: -8, marginBottom: 16 }}>
        Тебе не нужно справляться со всем. Найдём одно маленькое действие,
        которое можно сделать прямо сейчас.
      </p>

      <section>
        <div className="section-title">Сколько у тебя сегодня сил?</div>
        <EnergyPicker value={energy ?? 'unknown'} onChange={handleEnergy} />
        <p className="hint" style={{ margin: '10px 2px 0', fontSize: '0.82rem' }}>
          Здесь нет правильного ответа. Уровень можно менять в течение дня.
        </p>
      </section>

      <section>
        <div className="section-title">Чем займёмся?</div>
        <div className="category-grid">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className="category-tile"
              onClick={() => onOpenCategory(c.id)}
            >
              <span className="c-emoji">{c.emoji}</span>
              <span className="c-name">{c.name}</span>
              <span className="c-sub">{c.subtitle}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="section-title">Или попробуй</div>
        <div className="scenario-list">
          <button className="option-btn" onClick={onSurprise}>
            <span className="o-emoji">✨</span>
            <span>Выбери за меня — одно подходящее дело</span>
          </button>
          <button className="option-btn" onClick={onStartHere}>
            <span className="o-emoji">🌫️</span>
            <span>Не знаю, с чего начать</span>
          </button>
          <button className="option-btn" onClick={onRecover}>
            <span className="o-emoji">🌱</span>
            <span>Мне нужно восстановиться</span>
          </button>
        </div>
      </section>
    </div>
  );
}
