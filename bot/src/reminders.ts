import { InlineKeyboard, type Bot } from 'grammy';
import type { Db } from './db';

const REMINDER_TEXTS = [
  '🌱 Привет! Может быть, сегодня найдётся немного времени для одного маленького дела?\n\nНе обязательно делать всё. Может, выберем одно небольшое действие?',
  '🌿 Не нужно успевать всё. Достаточно одного маленького шага. Заглянем в «Шажок»?',
  '🍃 Хочешь сделать одно маленькое дело для своего пространства? Без спешки.',
];

export function localParts(now: Date, tz: string): { date: string; hm: string } {
  try {
    const dateFmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const date = dateFmt.format(now); // YYYY-MM-DD
    const hmFmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const parts = hmFmt.formatToParts(now);
    const h = parts.find((p) => p.type === 'hour')?.value ?? '00';
    const m = parts.find((p) => p.type === 'minute')?.value ?? '00';
    return { date, hm: `${h}:${m}` };
  } catch {
    const pad = (n: number) => String(n).padStart(2, '0');
    return {
      date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
      hm: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    };
  }
}

/** Запускает планировщик: проверка каждые 60 секунд. */
export function startScheduler(bot: Bot, db: Db, webappUrl: string): void {
  const tick = () => {
    void runTick(bot, db, webappUrl);
  };
  setTimeout(tick, 5000);
  setInterval(tick, 60_000);
}

async function runTick(bot: Bot, db: Db, webappUrl: string): Promise<void> {
  const now = new Date();
  for (const user of db.allUsers()) {
    const r = user.settings?.reminders;
    if (!r?.enabled) continue;
    if (user.chatId == null) continue;

    const { date, hm } = localParts(now, r.timezone || 'Europe/Moscow');

    let mutated = false;
    if (user.reminderState.lastSentDate !== date) {
      user.reminderState.lastSentDate = date;
      user.reminderState.sentCountToday = 0;
      user.reminderState.lastSentTimes = [];
      mutated = true;
    }
    if (user.reminderState.sentCountToday >= r.maxPerDay) {
      if (mutated) db.persist();
      continue;
    }
    if (user.reminderState.lastSentTimes.includes(hm)) continue;
    if (!r.times.includes(hm)) {
      if (mutated) db.persist();
      continue;
    }

    const text = REMINDER_TEXTS[Math.floor(Math.random() * REMINDER_TEXTS.length)];
    try {
      await bot.api.sendMessage(user.chatId, text, {
        reply_markup: new InlineKeyboard().webApp('Открыть Шажок 🌱', webappUrl),
      });
      user.reminderState.sentCountToday += 1;
      user.reminderState.lastSentTimes.push(hm);
      db.persist();
    } catch (err) {
      console.error('[reminders] Не удалось отправить напоминание:', err);
    }
  }
}
