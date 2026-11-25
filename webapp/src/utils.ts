export const uid = (): string =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/** Локальная дата в формате YYYY-MM-DD. */
export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISO(new Date());
}

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function daysAgoISO(n: number): string {
  return addDays(todayISO(), -n);
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  const today = todayISO();
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);
  if (iso === today) return 'Сегодня';
  if (iso === tomorrow) return 'Завтра';
  if (iso === yesterday) return 'Вчера';
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  });
}

/** Для истории побед: «сегодня», «вчера», «3 дня назад», или дата. */
export function formatRelative(isoDate: string): string {
  const today = todayISO();
  const diff = Math.round(
    (new Date(`${today}T00:00:00`).getTime() -
      new Date(`${isoDate}T00:00:00`).getTime()) /
      86400000
  );
  if (diff <= 0) return 'сегодня';
  if (diff === 1) return 'вчера';
  if (diff < 7) return `${diff} дн. назад`;
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

/** Склонение: 1 действие, 2 действия, 5 действий. */
export function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (d === 1) return one;
  if (d >= 2 && d <= 4) return few;
  return many;
}

/** Локальная зона пользователя (IANA). */
export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Moscow';
  } catch {
    return 'Europe/Moscow';
  }
}

/** «18:00» → для отображения. */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}
