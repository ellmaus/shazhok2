import { useState } from 'react';
import { useShazhok } from '../store';
import { useToast } from '../toast';
import { api } from '../api';
import { detectTimezone } from '../utils';
import Toggle from '../components/Toggle';
import type { PaletteId, FontSize, DetailLevel } from '../types';

const PALETTES: { id: PaletteId; name: string; colors: string[] }[] = [
  { id: 'standard', name: 'Стандартная', colors: ['#ffffff', '#5aa37a', '#2f3a33'] },
  { id: 'lowContrast', name: 'Мягкая', colors: ['#fbfbf9', '#8a94a6', '#4b4b4b'] },
  { id: 'dark', name: 'Тёмная', colors: ['#1d2328', '#6fbd90', '#eef2ef'] },
];

const FONT_SIZES: { id: FontSize; label: string }[] = [
  { id: 'S', label: 'S' },
  { id: 'M', label: 'M' },
  { id: 'L', label: 'L' },
];

const DETAIL_LEVELS: { id: DetailLevel; label: string }[] = [
  { id: 'brief', label: 'Кратко' },
  { id: 'normal', label: 'Обычно' },
  { id: 'detailed', label: 'Подробно' },
];

const TIME_PRESETS = ['09:00', '12:00', '15:00', '18:00', '20:00', '21:00'];

export default function SettingsScreen() {
  const settings = useShazhok((s) => s.settings);
  const setSettings = useShazhok((s) => s.setSettings);
  const setReminders = useShazhok((s) => s.setReminders);
  const clearAll = useShazhok((s) => s.clearAll);
  const show = useToast((s) => s.show);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [testing, setTesting] = useState(false);

  const reminders = settings.reminders;

  const toggleTime = (t: string) => {
    const has = reminders.times.includes(t);
    const times = has
      ? reminders.times.filter((x) => x !== t)
      : [...reminders.times, t].sort();
    setReminders({ times });
  };

  const testReminder = async () => {
    setTesting(true);
    const res = await api.testReminder();
    setTesting(false);
    if (res?.sent) show('Отправили тестовое напоминание 📩');
    else if (res?.reason === 'no-chat') show('Сначала напиши боту /start');
    else show('Не получилось отправить. Проверь, что бот запущен.');
  };

  return (
    <div>
      <header className="screen-head">
        <h1>⚙️ Настройки</h1>
      </header>

      <div className="settings-group">
        <h3>🎨 Оформление</h3>
        <div className="palette-options">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              className={`palette-option${settings.palette === p.id ? ' selected' : ''}`}
              onClick={() => setSettings({ palette: p.id })}
            >
              <div className="palette-preview">
                {p.colors.map((c) => (
                  <span key={c} style={{ backgroundColor: c }} />
                ))}
              </div>
              {p.name}
            </button>
          ))}
        </div>
        <div className="setting-row">
          <span className="label">Размер текста</span>
          <div className="seg">
            {FONT_SIZES.map((f) => (
              <button
                key={f.id}
                className={settings.fontSize === f.id ? 'active' : ''}
                onClick={() => setSettings({ fontSize: f.id })}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="setting-row">
          <span className="label">Повышенный контраст</span>
          <Toggle
            on={settings.contrast}
            onToggle={() => setSettings({ contrast: !settings.contrast })}
          />
        </div>
        <div className="setting-row">
          <span className="label">Простой режим</span>
          <Toggle
            on={settings.simpleMode}
            onToggle={() => setSettings({ simpleMode: !settings.simpleMode })}
          />
        </div>
        <div className="setting-row">
          <span className="label">
            Детализация шагов
            <span className="sub">Сколько пояснений показывать</span>
          </span>
          <div className="seg">
            {DETAIL_LEVELS.map((d) => (
              <button
                key={d.id}
                className={settings.detailLevel === d.id ? 'active' : ''}
                onClick={() => setSettings({ detailLevel: d.id })}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h3>🧠 Сенсорный профиль</h3>
        <div className="setting-row">
          <span className="label">Анимации</span>
          <Toggle
            on={settings.animations}
            onToggle={() => setSettings({ animations: !settings.animations })}
          />
        </div>
        <div className="setting-row">
          <span className="label">Вибрация</span>
          <Toggle
            on={settings.vibrations}
            onToggle={() => setSettings({ vibrations: !settings.vibrations })}
          />
        </div>
      </div>

      <div className="settings-group">
        <h3>🔔 Мягкие напоминания</h3>
        <div className="setting-row">
          <span className="label">
            Напоминания
            <span className="sub">Через Telegram-бота, без давления</span>
          </span>
          <Toggle
            on={reminders.enabled}
            onToggle={() => setReminders({ enabled: !reminders.enabled })}
          />
        </div>
        {reminders.enabled ? (
          <>
            <div className="setting-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <span className="label">Время (можно несколько)</span>
              <div className="time-chips" style={{ marginTop: 8 }}>
                {TIME_PRESETS.map((t) => (
                  <button
                    key={t}
                    className={`time-chip${reminders.times.includes(t) ? ' selected' : ''}`}
                    onClick={() => toggleTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="setting-row">
              <span className="label">
                Максимум в день
                <span className="sub">Чтобы не превратилось в стресс</span>
              </span>
              <div className="seg">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    className={reminders.maxPerDay === n ? 'active' : ''}
                    onClick={() => setReminders({ maxPerDay: n })}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="setting-row">
              <span className="label">
                Часовой пояс
                <span className="sub">{reminders.timezone || detectTimezone()}</span>
              </span>
            </div>
            <button
              className="btn ghost small"
              style={{ marginTop: 10 }}
              onClick={testReminder}
              disabled={testing}
            >
              {testing ? 'Отправляем…' : '📩 Отправить тестовое напоминание'}
            </button>
          </>
        ) : null}
      </div>

      <div className="settings-group">
        <h3>ℹ️ О приложении</h3>
        <p className="hint" style={{ margin: 0 }}>
          «Шажок» — инструмент повседневной самоподдержки, а не медицинское
          изделие и не источник новых обязанностей. Адаптация к энергии,
          маленькие шаги и никакого чувства вины.
        </p>
      </div>

      <div className="settings-group">
        <h3>🔒 Данные</h3>
        <div className="setting-row">
          <span className="label">
            Хранение
            <span className="sub">На устройстве и в боте (если он подключён)</span>
          </span>
        </div>
        <div className="setting-row">
          <span className="label">Сбросить все данные</span>
          <button
            className="btn danger small"
            style={{ flex: '0 0 auto' }}
            onClick={() => {
              if (confirmDelete) {
                clearAll();
                setConfirmDelete(false);
              } else {
                setConfirmDelete(true);
                window.setTimeout(() => setConfirmDelete(false), 4000);
              }
            }}
          >
            {confirmDelete ? 'Точно сбросить?' : 'Сбросить'}
          </button>
        </div>
      </div>
    </div>
  );
}
