import { useMemo, useRef, useState } from 'react';
import { useShazhok, customToDisplay, toDisplay, type DisplayScenario } from '../store';
import { scenarioById } from '../data/scenarios';
import { haptic } from '../telegram';
import ProgressBar from '../components/ProgressBar';

interface ScenarioDetailScreenProps {
  scenarioId: string;
  onClose: () => void;
}

export default function ScenarioDetailScreen({
  scenarioId,
  onClose,
}: ScenarioDetailScreenProps) {
  const customScenarios = useShazhok((s) => s.customScenarios);
  const detailLevel = useShazhok((s) => s.settings.detailLevel);
  const recordWin = useShazhok((s) => s.recordWin);

  const scenario: DisplayScenario | undefined = useMemo(() => {
    const lib = scenarioById(scenarioId);
    if (lib) return toDisplay(lib);
    const custom = customScenarios.find((c) => c.id === scenarioId);
    return custom ? customToDisplay(custom) : undefined;
  }, [scenarioId, customScenarios]);

  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState<Set<number>>(() => new Set());
  const [finished, setFinished] = useState(false);
  const recordedRef = useRef(false);

  if (!scenario) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="empty-state">
            <div className="big">🌫️</div>
            <p>Сценарий не найден.</p>
            <button className="btn secondary" onClick={onClose}>
              Назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = scenario.steps.length;
  const current = scenario.steps[stepIndex];

  const recordIfNeeded = (doneSet: Set<number>) => {
    if (!recordedRef.current && doneSet.size > 0) {
      recordedRef.current = true;
      recordWin({
        scenarioId: scenario.id,
        familyId: scenario.familyId,
        title: scenario.title,
        categoryId: scenario.categoryId,
        emoji: scenario.emoji,
        stepsDone: doneSet.size,
        stepsTotal: total,
      });
    }
  };

  const advance = (doneSet: Set<number>) => {
    if (stepIndex + 1 >= total) {
      setFinished(true);
      recordIfNeeded(doneSet);
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const markStep = () => {
    haptic('success');
    const next = new Set(done);
    next.add(stepIndex);
    setDone(next);
    advance(next);
  };

  const skipStep = () => {
    haptic('light');
    advance(done);
  };

  const stop = () => {
    setFinished(true);
    recordIfNeeded(done);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="stepper">
          <div className="st-top">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button className="icon-btn" onClick={onClose} aria-label="Закрыть">
                ✕
              </button>
              <div style={{ flex: 1 }}>
                <h2 className="st-title">{scenario.emoji} {scenario.title}</h2>
                <div className="st-count">
                  {finished
                    ? 'Готово'
                    : `Шаг ${Math.min(stepIndex + 1, total)} из ${total} · ${scenario.minutes}`}
                </div>
              </div>
            </div>
            <ProgressBar
              value={finished ? 1 : total > 0 ? stepIndex / total : 0}
            />
          </div>

          {finished ? (
            <div className="done-hero">
              <span className="big">🌱</span>
              <h2>Маленькая победа!</h2>
              <p>
                Ты {done.size > 0 ? `сделал(а) ${done.size} из ${total} шагов` : 'попробовал(а) сегодня'}.
                Это уже результат — независимо от того, сколько получилось.
              </p>
              <p style={{ fontStyle: 'italic' }}>
                {scenario.gentleNote ?? 'Не нужно успевать всё. Достаточно одного шага.'}
              </p>
              <button className="btn primary" style={{ marginTop: 8 }} onClick={onClose}>
                Отлично
              </button>
            </div>
          ) : (
            <>
              <div className="step-card">
                <span className="st-emoji">{current.emoji ?? scenario.emoji}</span>
                <span className="st-step-title">{current.title}</span>
                {detailLevel !== 'brief' && current.text ? (
                  <span className="st-step-text">{current.text}</span>
                ) : null}
                {detailLevel === 'detailed' && scenario.gentleNote ? (
                  <span className="st-gentle">{scenario.gentleNote}</span>
                ) : null}
              </div>

              <div className="stepper-actions">
                <button className="btn primary" onClick={markStep}>
                  ✅ Я сделал(а) этот шаг
                </button>
                <div className="row">
                  <button className="btn secondary" onClick={skipStep}>
                    Пропустить
                  </button>
                  <button className="btn ghost" onClick={stop}>
                    Остановиться
                  </button>
                </div>
              </div>
              <p className="stop-hint">
                Можно остановиться в любой момент. Даже один шаг — результат.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
