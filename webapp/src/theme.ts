import type { Settings } from './types';

/** Применяет настройки к <html> через data-атрибуты (CSS опирается на них). */
export function applyTheme(settings: Settings): void {
  const root = document.documentElement;
  root.setAttribute('data-palette', settings.palette);
  root.setAttribute('data-font', settings.fontSize);
  root.setAttribute('data-animations', settings.animations ? 'on' : 'off');
  root.setAttribute('data-contrast', settings.contrast ? 'on' : 'off');
  root.setAttribute('data-simple', settings.simpleMode ? 'on' : 'off');
}

export const DEFAULT_SETTINGS: Settings = {
  palette: 'standard',
  animations: true,
  vibrations: true,
  fontSize: 'M',
  contrast: false,
  simpleMode: false,
  detailLevel: 'normal',
  defaultEnergy: 'auto',
  reminders: {
    enabled: false,
    times: ['18:00'],
    timezone: 'Europe/Moscow',
    maxPerDay: 2,
  },
};
