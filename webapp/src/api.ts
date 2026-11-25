import type { Settings, UserProfile, WinRecord } from './types';
import { getInitData, getUserId } from './telegram';

/**
 * Клиент бэкенда. Все вызовы — best-effort: при недоступности сети
 * (режим предпросмотра в браузере) возвращают null, и приложение
 * продолжает работать на localStorage.
 */

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T | null> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const initData = getInitData();
    if (initData) {
      headers['X-Init-Data'] = initData;
    } else {
      headers['X-Dev-Id'] = getUserId();
    }
    const res = await fetch(`/api${path}`, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body != null ? JSON.stringify(opts.body) : undefined,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export interface RemoteUser {
  id: string;
  name: string;
  settings: Settings;
  customScenarios: UserProfile['customScenarios'];
  favoriteScenarioIds: string[];
  wins: WinRecord[];
  /** true, если бот уже знает чат (присылал /start) и может писать. */
  chatKnown: boolean;
}

export const api = {
  me: () => request<RemoteUser>('/me'),

  saveMe: (patch: {
    name?: string;
    settings?: Settings;
    customScenarios?: UserProfile['customScenarios'];
    favoriteScenarioIds?: string[];
  }) => request<{ ok: boolean }>('/me', { method: 'PUT', body: patch }),

  testReminder: () =>
    request<{ ok: boolean; sent?: boolean; reason?: string }>('/reminders/test', {
      method: 'POST',
    }),

  addWin: (win: Omit<WinRecord, 'id' | 'completedAt'>) =>
    request<{ ok: boolean }>('/wins', { method: 'POST', body: win }),
};
