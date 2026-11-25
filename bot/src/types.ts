export interface BackendWin {
  id: string;
  scenarioId: string;
  familyId: string;
  title: string;
  categoryId: string;
  emoji: string;
  stepsDone: number;
  stepsTotal: number;
  completedAt: string;
}

export interface ReminderSettings {
  enabled: boolean;
  times: string[];
  timezone: string;
  maxPerDay: number;
}

export interface BackendSettings {
  palette: string;
  animations: boolean;
  vibrations: boolean;
  fontSize: string;
  contrast: boolean;
  simpleMode: boolean;
  detailLevel: string;
  defaultEnergy: string;
  reminders: ReminderSettings;
}

export interface CustomScenario {
  id: string;
  emoji: string;
  title: string;
  categoryId: string;
  energy: string;
  minutes: string;
  steps: { title: string; text?: string; emoji?: string }[];
  createdAt: string;
}

export interface ReminderState {
  /** Локальная дата (в зоне пользователя) последней отправки. */
  lastSentDate: string;
  sentCountToday: number;
  lastSentTimes: string[];
}

export interface BackendUser {
  id: string;
  /** Telegram chat id (для отправки напоминаний). null, пока не написал /start. */
  chatId: number | null;
  name: string;
  settings: BackendSettings;
  customScenarios: CustomScenario[];
  favoriteScenarioIds: string[];
  wins: BackendWin[];
  reminderState: ReminderState;
}

export const DEFAULT_SETTINGS: BackendSettings = {
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

export function defaultUser(id: string): BackendUser {
  return {
    id,
    chatId: null,
    name: '',
    settings: { ...DEFAULT_SETTINGS, reminders: { ...DEFAULT_SETTINGS.reminders } },
    customScenarios: [],
    favoriteScenarioIds: [],
    wins: [],
    reminderState: { lastSentDate: '', sentCountToday: 0, lastSentTimes: [] },
  };
}
