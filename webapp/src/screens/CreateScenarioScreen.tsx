import { useState } from 'react';
import { useShazhok } from '../store';
import { useToast } from '../toast';
import { CATEGORIES } from '../data/categories';
import { ENERGY_LEVELS } from '../data/energy';
import type { EnergyLevel } from '../types';

interface CreateScenarioScreenProps {
  onClose: () => void;
}

export default function CreateScenarioScreen({ onClose }: CreateScenarioScreenProps) {
  const addCustomScenario = useShazhok((s) => s.addCustomScenario);
  const energy = useShazhok((s) => s.energy);
  const show = useToast((s) => s.show);

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('cleaning');
  const [level, setLevel] = useState<EnergyLevel>(energy ?? 'medium');
  const [minutes, setMinutes] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [draft, setDraft] = useState('');

  const addStep = () => {
    const v = draft.trim();
    if (!v) return;
    setSteps((s) => [...s, v]);
    setDraft('');
  };

  const autoSplit = () => {
    setSteps([
      'Собери всё, что понадобится',
      title.trim() ? `Сделай: ${title.trim()}` : 'Сделай основное действие',
      'Наведи порядок вокруг',
    ]);
  };

  const save = () => {
    const t = title.trim();
    if (!t) {
      show('Добавь название задачи');
      return;
    }
    const finalSteps = steps.length > 0 ? steps : ['Сделай: ' + t];
    addCustomScenario({
      emoji: CATEGORIES.find((c) => c.id === categoryId)?.emoji ?? '📝',
      title: t,
      categoryId,
      energy: level,
      minutes: minutes.trim() || '5 мин',
      steps: finalSteps.map((s) => ({ title: s })),
    });
    show('Задача сохранена ✅');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="screen-head">
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть">
            ←
          </button>
          <h1>Новая задача</h1>
        </div>

        <div className="field">
          <label>Что нужно сделать?</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: убраться в комнате"
            maxLength={80}
          />
        </div>

        <div className="field">
          <label>Категория</label>
          <div className="time-chips">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`time-chip${categoryId === c.id ? ' selected' : ''}`}
                onClick={() => setCategoryId(c.id)}
              >
                {c.emoji} {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Сколько примерно сил нужно?</label>
          <div className="time-chips">
            {ENERGY_LEVELS.map((e) => (
              <button
                key={e.id}
                className={`time-chip${level === e.id ? ' selected' : ''}`}
                onClick={() => setLevel(e.id)}
              >
                {e.emoji} {e.title}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Сколько времени готов(а) уделить? (необязательно)</label>
          <input
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="Например: 10 мин"
          />
        </div>

        <div className="field">
          <label>Шаги</label>
          {steps.length > 0 ? (
            <div style={{ marginBottom: 10 }}>
              {steps.map((s, i) => (
                <div key={i} className="step-editor-row">
                  <span style={{ alignSelf: 'center', fontSize: '1.2rem' }}>{i + 1}.</span>
                  <input value={s} readOnly />
                  <button
                    className="icon-btn"
                    style={{ width: 36, height: 36, fontSize: 14 }}
                    onClick={() => setSteps((prev) => prev.filter((_, j) => j !== i))}
                    aria-label="Удалить шаг"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <div className="step-editor-row">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addStep()}
              placeholder="Напиши шаг"
            />
            <button className="btn secondary small" style={{ flex: '0 0 auto' }} onClick={addStep}>
              ＋
            </button>
          </div>
          <button className="btn ghost small" onClick={autoSplit}>
            ✨ Разбить автоматически
          </button>
        </div>

        <button className="btn primary" onClick={save}>
          Сохранить задачу
        </button>
      </div>
    </div>
  );
}
