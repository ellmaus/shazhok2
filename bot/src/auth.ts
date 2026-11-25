import { createHmac } from 'node:crypto';

/**
 * Проверка подписи initData от Telegram WebApp.
 * Возвращает id пользователя (и имя), если подпись валидна, иначе null.
 */
export function verifyInitData(
  initData: string,
  botToken: string
): { id: number; firstName?: string } | null {
  if (!initData || !botToken) return null;

  const entries: [string, string][] = [];
  let hash = '';
  for (const pair of initData.split('&')) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const k = pair.slice(0, idx);
    const v = pair.slice(idx + 1);
    if (k === 'hash') hash = v;
    else entries.push([k, v]);
  }
  if (!hash) return null;

  entries.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join('\n');

  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computed = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  if (computed !== hash) return null;

  const userPair = entries.find(([k]) => k === 'user');
  if (!userPair) return null;
  try {
    const user = JSON.parse(decodeURIComponent(userPair[1])) as {
      id?: number;
      first_name?: string;
    };
    if (typeof user.id === 'number') {
      return { id: user.id, firstName: user.first_name };
    }
  } catch {
    /* ignore */
  }
  return null;
}
