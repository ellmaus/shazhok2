/**
 * Тонкая обёртка над Telegram WebApp API.
 * Внутри Telegram доступен window.Telegram.WebApp; в обычном браузере —
 * возвращаем null, и приложение работает в режиме предпросмотра (mock).
 */

interface TgWebApp {
  ready: () => void;
  expand: () => void;
  disableVerticalSwipes?: () => void;
  initData?: string;
  initDataUnsafe?: {
    user?: { id?: number; first_name?: string };
  };
  colorScheme?: 'light' | 'dark';
  HapticFeedback?: {
    impactOccurred?: (style: string) => void;
    notificationOccurred?: (type: string) => void;
  };
}

function getWebApp(): TgWebApp | null {
  const tg = (window as unknown as { Telegram?: { WebApp?: TgWebApp } }).Telegram;
  return tg?.WebApp ?? null;
}

export function isInTelegram(): boolean {
  return getWebApp() !== null;
}

/** Вызывается один раз при старте. */
export function initTelegram(): void {
  const app = getWebApp();
  if (!app) return;
  try {
    app.ready();
    app.expand();
    app.disableVerticalSwipes?.();
  } catch {
    /* ignore */
  }
}

/** Сырые initData (для проверки подписи на бэкенде). */
export function getInitData(): string {
  return getWebApp()?.initData ?? '';
}

/** Идентификатор пользователя (для локального разделения данных без сети). */
export function getUserId(): string {
  const app = getWebApp();
  const id = app?.initDataUnsafe?.user?.id;
  return id != null ? String(id) : 'dev-user';
}

/** Имя из Telegram (как подсказка при знакомстве). */
export function getTelegramName(): string {
  const name = getWebApp()?.initDataUnsafe?.user?.first_name;
  return name ?? '';
}

/** Лёгкая тактильная отдача (если включена и доступна). */
export function haptic(kind: 'light' | 'success' | 'error' = 'light'): void {
  const app = getWebApp();
  try {
    if (kind === 'success') {
      app?.HapticFeedback?.notificationOccurred?.('success');
    } else if (kind === 'error') {
      app?.HapticFeedback?.notificationOccurred?.('error');
    } else {
      app?.HapticFeedback?.impactOccurred?.('light');
    }
  } catch {
    /* ignore */
  }
}
