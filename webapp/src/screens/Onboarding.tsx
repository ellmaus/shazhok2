import { useState } from 'react';
import { useShazhok } from '../store';
import { getTelegramName } from '../telegram';

export default function Onboarding() {
  const finishOnboarding = useShazhok((s) => s.finishOnboarding);
  const [name, setName] = useState(getTelegramName());

  const start = () => {
    finishOnboarding(name.trim());
  };

  return (
    <div className="onboarding">
      <div className="logo">🌱</div>
      <h1>Шажок</h1>
      <p className="lead">
        Помощник по бытовым делам, который учитывает твои силы и разбивает
        большие задачи на маленькие действия — без чувства вины.
      </p>
      <p className="quote">Не нужно успевать всё. Достаточно одного маленького шага.</p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && start()}
        placeholder="Как тебя называть? (необязательно)"
        aria-label="Имя"
        maxLength={40}
      />
      <button className="btn primary" onClick={start}>
        Начать
      </button>
    </div>
  );
}
