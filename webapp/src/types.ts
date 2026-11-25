export type EnergyLevel = 'low' | 'medium' | 'high';

export type DetailLevel = 'brief' | 'normal' | 'detailed';

export interface ScenarioStep {
  /** Короткое, однозначное действие. */
  title: string;
  /** Поддерживающее пояснение (что именно делать, без давления). */
  text?: string;
  /** Иллюстрация-эмодзи. */
  emoji?: string;
}

export interface Scenario {
  id: string;
  /** Связывает варианты одной задачи по разным уровням энергии. */
  familyId: string;
  categoryId: string;
  emoji: string;
  title: string;
  description: string;
  /** Уровень энергии, на который рассчитан сценарий. */
  energy: EnergyLevel;
  /** «2 мин», «3–5 мин», «15–20 мин». */
  minutes: string;
  steps: ScenarioStep[];
  /** Мягкая подсказка-поддержка в конце инструкции. */
  gentleNote?: string;
}

export interface Category {
  id: string;
  emoji: string;
  name: string;
  /** Подзаголовок для карточки категории. */
  subtitle: string;
}

export interface CustomScenario {
  id: string;
  emoji: string;
  title: string;
  categoryId: string;
  energy: EnergyLevel;
  minutes: string;
  steps: ScenarioStep[];
  createdAt: string;
}

export type PaletteId = 'standard' | 'lowContrast' | 'dark';
export type FontSize = 'S' | 'M' | 'L';

export interface ReminderSettings {
  enabled: boolean;
  /** Локальные часы «HH:MM». */
  times: string[];
  /** IANA-зона, например Europe/Moscow. */
  timezone: string;
  /** Максимум напоминаний в день. */
  maxPerDay: number;
}

export interface Settings {
  palette: PaletteId;
  animations: boolean;
  vibrations: boolean;
  fontSize: FontSize;
  contrast: boolean;
  /** Максимально простой режим: меньше элементов, крупнее кнопки. */
  simpleMode: boolean;
  detailLevel: DetailLevel;
  defaultEnergy: EnergyLevel | 'auto';
  reminders: ReminderSettings;
}

export interface WinRecord {
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

/** Состояние пользователя, которое синхронизируется с бэкендом. */
export interface UserProfile {
  id: string;
  name: string;
  settings: Settings;
  customScenarios: CustomScenario[];
  favoriteScenarioIds: string[];
  wins: WinRecord[];
}
