export type Tab = 'home' | 'scenarios' | 'tasks' | 'wins' | 'settings';

const TABS: { id: Tab; emoji: string; label: string }[] = [
  { id: 'home', emoji: '🏠', label: 'Главная' },
  { id: 'scenarios', emoji: '📚', label: 'Сценарии' },
  { id: 'tasks', emoji: '📝', label: 'Мои задачи' },
  { id: 'wins', emoji: '🌱', label: 'Мои успехи' },
  { id: 'settings', emoji: '⚙️', label: 'Настройки' },
];

interface BottomNavProps {
  active: Tab;
  onChange: (t: Tab) => void;
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottomnav">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={active === t.id ? 'active' : ''}
          onClick={() => onChange(t.id)}
          aria-current={active === t.id ? 'page' : undefined}
        >
          <span className="nav-emoji">{t.emoji}</span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
