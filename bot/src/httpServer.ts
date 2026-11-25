import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { randomUUID } from 'node:crypto';
import { InlineKeyboard, type Bot } from 'grammy';
import type { Db } from './db';
import { verifyInitData } from './auth';
import type { BackendSettings, BackendUser, BackendWin, CustomScenario } from './types';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Init-Data, X-Dev-Id',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
};

function json(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...CORS,
  });
  res.end(JSON.stringify(body));
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = chunk as Buffer;
    size += buf.length;
    if (size > 1_000_000) throw new Error('payload too large');
    chunks.push(buf);
  }
  const raw = Buffer.concat(chunks).toString('utf-8');
  if (!raw) return null;
  return JSON.parse(raw);
}

/** Возвращает id пользователя из заголовков (проверенная подпись или dev-режим). */
function resolveUser(req: IncomingMessage, botToken: string): { id: string } | null {
  const initData = req.headers['x-init-data'];
  if (typeof initData === 'string' && initData) {
    const v = verifyInitData(initData, botToken);
    return v ? { id: String(v.id) } : null;
  }
  const devId = req.headers['x-dev-id'];
  if (typeof devId === 'string' && devId) return { id: devId };
  return null;
}

function publicUser(user: BackendUser) {
  return {
    id: user.id,
    name: user.name,
    settings: user.settings,
    customScenarios: user.customScenarios,
    favoriteScenarioIds: user.favoriteScenarioIds,
    wins: user.wins,
    chatKnown: user.chatId != null,
  };
}

interface ServerOptions {
  db: Db;
  botToken: string;
  bot: Bot;
  webappUrl: string;
  staticDir: string | null;
  /** Обработчик входящих обновлений Telegram (режим webhook). */
  webhookHandler?: (
    req: IncomingMessage,
    res: ServerResponse
  ) => Promise<void> | void;
}

async function handleApi(
  req: IncomingMessage,
  res: ServerResponse,
  url: URL,
  opts: ServerOptions
): Promise<void> {
  const method = req.method ?? 'GET';
  const path = url.pathname;

  // GET /api/me
  if (method === 'GET' && path === '/api/me') {
    const uid = resolveUser(req, opts.botToken);
    if (!uid) return json(res, 401, { error: 'unauthorized' });
    return json(res, 200, publicUser(opts.db.getUser(uid.id)));
  }

  // PUT /api/me
  if (method === 'PUT' && path === '/api/me') {
    const uid = resolveUser(req, opts.botToken);
    if (!uid) return json(res, 401, { error: 'unauthorized' });
    let body: unknown;
    try {
      body = await readBody(req);
    } catch {
      return json(res, 400, { error: 'bad json' });
    }
    const patch = (body ?? {}) as Record<string, unknown>;
    const current = opts.db.getUser(uid.id);
    const upd: Partial<BackendUser> = {};

    if (typeof patch.name === 'string') upd.name = patch.name;
    if (patch.settings && typeof patch.settings === 'object') {
      const s = patch.settings as Partial<BackendSettings>;
      upd.settings = {
        ...current.settings,
        ...s,
        reminders: { ...current.settings.reminders, ...(s.reminders ?? {}) },
      };
    }
    if (Array.isArray(patch.customScenarios)) {
      upd.customScenarios = patch.customScenarios as CustomScenario[];
    }
    if (Array.isArray(patch.favoriteScenarioIds)) {
      upd.favoriteScenarioIds = patch.favoriteScenarioIds as string[];
    }
    opts.db.updateUser(uid.id, upd);
    return json(res, 200, { ok: true });
  }

  // POST /api/wins
  if (method === 'POST' && path === '/api/wins') {
    const uid = resolveUser(req, opts.botToken);
    if (!uid) return json(res, 401, { error: 'unauthorized' });
    let body: unknown;
    try {
      body = await readBody(req);
    } catch {
      return json(res, 400, { error: 'bad json' });
    }
    const input = (body ?? {}) as Omit<BackendWin, 'id' | 'completedAt'>;
    if (!input.title) return json(res, 400, { error: 'missing title' });
    const user = opts.db.getUser(uid.id);
    const win: BackendWin = {
      id: randomUUID(),
      scenarioId: input.scenarioId ?? '',
      familyId: input.familyId ?? '',
      title: input.title,
      categoryId: input.categoryId ?? '',
      emoji: input.emoji ?? '🌱',
      stepsDone: Number(input.stepsDone) || 0,
      stepsTotal: Number(input.stepsTotal) || 0,
      completedAt: new Date().toISOString(),
    };
    opts.db.updateUser(uid.id, { wins: [win, ...user.wins].slice(0, 500) });
    return json(res, 200, { ok: true });
  }

  // POST /api/reminders/test
  if (method === 'POST' && path === '/api/reminders/test') {
    const uid = resolveUser(req, opts.botToken);
    if (!uid) return json(res, 401, { error: 'unauthorized' });
    const user = opts.db.getUser(uid.id);
    if (user.chatId == null) {
      return json(res, 200, { ok: true, sent: false, reason: 'no-chat' });
    }
    try {
      await opts.bot.api.sendMessage(
        user.chatId,
        '🌱 Это тестовое напоминание от «Шажок». Всё работает — мягко, без спешки.',
        {
          reply_markup: new InlineKeyboard().webApp('Открыть Шажок 🌱', opts.webappUrl),
        }
      );
      return json(res, 200, { ok: true, sent: true });
    } catch (err) {
      console.error('[api] тестовое напоминание не ушло:', err);
      return json(res, 200, { ok: true, sent: false, reason: 'error' });
    }
  }

  return json(res, 404, { error: 'not found' });
}

async function serveStatic(
  req: IncomingMessage,
  res: ServerResponse,
  staticDir: string,
  pathname: string
): Promise<void> {
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let filePath = join(staticDir, safe === '/' || safe === '' ? 'index.html' : safe);

  if (!existsSync(filePath)) {
    // SPA fallback: для путей без расширения отдаём index.html
    if (extname(safe) === '') {
      filePath = join(staticDir, 'index.html');
    }
    if (!existsSync(filePath)) {
      return json(res, 404, {
        error: 'not found',
        hint: 'Соберите фронтенд: npm run build',
      });
    }
  }

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = join(filePath, 'index.html');
    const data = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    json(res, 404, { error: 'not found' });
  }
}

export function createHttpServer(opts: ServerOptions) {
  return createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const path = url.pathname;

    if (req.method === 'OPTIONS') {
      res.writeHead(204, CORS);
      res.end();
      return;
    }

    if (path === '/webhook' && req.method === 'POST' && opts.webhookHandler) {
      try {
        await opts.webhookHandler(req, res);
      } catch (err) {
        console.error('[webhook] Ошибка:', err);
        if (!res.headersSent) {
          res.writeHead(500);
          res.end('error');
        }
      }
      return;
    }

    if (path.startsWith('/api/')) {
      try {
        await handleApi(req, res, url, opts);
      } catch (err) {
        console.error('[api] Ошибка обработчика:', err);
        json(res, 500, { error: 'internal' });
      }
      return;
    }

    if (opts.staticDir && (req.method === 'GET' || req.method === 'HEAD')) {
      await serveStatic(req, res, opts.staticDir, path);
      return;
    }

    json(res, 404, { error: 'not found' });
  });
}
