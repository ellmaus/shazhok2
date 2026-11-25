import 'dotenv/config';
import { Bot, InlineKeyboard, webhookCallback } from 'grammy';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Db } from './db';
import { createHttpServer } from './httpServer';
import { startScheduler } from './reminders';

const token = process.env.BOT_TOKEN;
const port = Number(process.env.PORT ?? 3001);
// Адрес Mini App (кнопка бота). На Render берётся из RENDER_EXTERNAL_URL.
const webappUrl = process.env.WEBAPP_URL || process.env.RENDER_EXTERNAL_URL || '';
// Базовый публичный URL для webhook (на Render — RENDER_EXTERNAL_URL).
const webhookBase = process.env.WEBHOOK_URL || process.env.RENDER_EXTERNAL_URL || '';
const useWebhook = Boolean(webhookBase);

if (!token) {
  console.error(
    '[bot] BOT_TOKEN не задан. Скопируй bot/.env.example в bot/.env и впиши токен от @BotFather.'
  );
  process.exit(1);
}

const db = new Db();
const bot = new Bot(token);

const openKeyboard = () => new InlineKeyboard().webApp('Открыть Шажок 🌱', webappUrl);

bot.command('start', async (ctx) => {
  const id = ctx.from?.id != null ? String(ctx.from.id) : '';
  if (id) {
    db.updateUser(id, { chatId: ctx.chat?.id ?? null });
  }
  const name = ctx.from?.first_name ?? '';
  await ctx.reply(
    `Привет${name ? `, ${name}` : ''}! 🌱\n\n` +
      'Я — Шажок, помощник по бытовым делам без перегруза.\n\n' +
      'Тебе не нужно справляться со всем. Давай найдём одно маленькое действие, ' +
      'которое можно сделать прямо сейчас.',
    { reply_markup: openKeyboard() }
  );
  try {
    await bot.api.setChatMenuButton({
      menu_button: {
        type: 'web_app',
        text: 'Шажок 🌱',
        web_app: { url: webappUrl },
      },
    });
  } catch (err) {
    console.warn('[bot] Не удалось установить кнопку меню:', err);
  }
});

bot.command('off', async (ctx) => {
  const id = ctx.from?.id != null ? String(ctx.from.id) : '';
  if (id) {
    const u = db.getUser(id);
    db.updateUser(id, {
      settings: {
        ...u.settings,
        reminders: { ...u.settings.reminders, enabled: false },
      },
    });
  }
  await ctx.reply(
    'Напоминания выключены 💤. Включить их снова можно в приложении: ⚙️ → Напоминания.'
  );
});

bot.command('help', async (ctx) => {
  await ctx.reply(
    'Открой «Шажок», чтобы выбрать уровень энергии и одно маленькое дело.\n\n' +
      'Напоминания настраиваются в приложении (⚙️ → Напоминания), ' +
      'а выключить их можно командой /off.',
    { reply_markup: openKeyboard() }
  );
});

bot.on('message', async (ctx) => {
  const id = ctx.from?.id != null ? String(ctx.from.id) : '';
  if (id) db.updateUser(id, { chatId: ctx.chat?.id ?? null });
  await ctx.reply('Открой «Шажок» — найдём один маленький шаг 👇', {
    reply_markup: openKeyboard(),
  });
});

bot.catch((err) => console.error('[bot] Ошибка:', err.error));

// HTTP-сервер: API + (опционально) статическая раздача собранного Mini App + webhook.
const staticDirDefault = fileURLToPath(new URL('../../webapp/dist', import.meta.url));
const staticDir = process.env.STATIC_DIR ?? (existsSync(staticDirDefault) ? staticDirDefault : null);

const webhookHandler = useWebhook ? webhookCallback(bot, 'http') : undefined;
const server = createHttpServer({ db, botToken: token, bot, webappUrl, staticDir, webhookHandler });
server.listen(port, () => {
  console.log(`[server] API и статика на http://localhost:${port}`);
  if (!staticDir) {
    console.log('[server] Папка webapp/dist не найдена — собери фронт: npm run build');
  }
  if (useWebhook) {
    const webhookUrl = `${webhookBase}/webhook`;
    bot.api
      .setWebhook(webhookUrl, { drop_pending_updates: true })
      .then(() => console.log('[bot] Webhook установлен:', webhookUrl))
      .catch((err) => console.error('[bot] Не удалось установить webhook:', err));
  } else {
    void bot.start();
    console.log('[bot] Запущен (long polling). WEBAPP_URL =', webappUrl || '(не задан)');
  }
});

startScheduler(bot, db, webappUrl);
