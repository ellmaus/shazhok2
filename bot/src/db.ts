import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultUser, type BackendUser } from './types';

interface DbShape {
  users: Record<string, BackendUser>;
}

const DEFAULT_PATH = fileURLToPath(new URL('../data/db.json', import.meta.url));

/**
 * Простое JSON-хранилище (без нативных зависимостей). Достаточно для MVP:
 * сотни пользователей и история без тяжёлых запросов.
 */
export class Db {
  private path: string;
  private data: DbShape;

  constructor(path = DEFAULT_PATH) {
    this.path = path;
    this.data = { users: {} };
    try {
      const raw = readFileSync(path, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<DbShape>;
      if (parsed && typeof parsed === 'object' && parsed.users) {
        this.data = { users: parsed.users };
      }
    } catch {
      // файла ещё нет — начнём с пустой базы
    }
  }

  getUser(id: string): BackendUser {
    if (!this.data.users[id]) {
      this.data.users[id] = defaultUser(id);
      this.persist();
    }
    return this.data.users[id];
  }

  updateUser(id: string, patch: Partial<BackendUser>): BackendUser {
    const user = this.getUser(id);
    this.data.users[id] = { ...user, ...patch };
    this.persist();
    return this.data.users[id];
  }

  allUsers(): BackendUser[] {
    return Object.values(this.data.users);
  }

  persist(): void {
    try {
      mkdirSync(dirname(this.path), { recursive: true });
      writeFileSync(this.path, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[db] Не удалось сохранить базу:', err);
    }
  }
}
