import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CustomScenario,
  EnergyLevel,
  ReminderSettings,
  Scenario,
  ScenarioStep,
  Settings,
  WinRecord,
} from './types';
import { DEFAULT_SETTINGS } from './theme';
import { uid } from './utils';
import { api } from './api';

interface AddCustomInput {
  emoji: string;
  title: string;
  categoryId: string;
  energy: EnergyLevel;
  minutes: string;
  steps: ScenarioStep[];
}

interface RecordWinInput {
  scenarioId: string;
  familyId: string;
  title: string;
  categoryId: string;
  emoji: string;
  stepsDone: number;
  stepsTotal: number;
}

interface ShazhokState {
  onboardingDone: boolean;
  name: string;
  settings: Settings;
  /** Текущий уровень энергии за сессию/день. null = ещё не выбран. */
  energy: EnergyLevel | null;
  customScenarios: CustomScenario[];
  favoriteScenarioIds: string[];
  wins: WinRecord[];
  /** true, если уже пробовали синхронизироваться с бэкендом. */
  remoteReady: boolean;

  finishOnboarding: (name: string) => void;
  setName: (name: string) => void;
  setSettings: (patch: Partial<Settings>) => void;
  setReminders: (patch: Partial<ReminderSettings>) => void;
  setEnergy: (e: EnergyLevel) => void;

  addCustomScenario: (input: AddCustomInput) => CustomScenario;
  deleteCustomScenario: (id: string) => void;
  toggleFavorite: (scenarioId: string) => void;

  recordWin: (input: RecordWinInput) => void;
  hydrateFromRemote: () => Promise<void>;
  clearAll: () => void;
}

export const useShazhok = create<ShazhokState>()(
  persist(
    (set, get) => ({
      onboardingDone: false,
      name: '',
      settings: DEFAULT_SETTINGS,
      energy: null,
      customScenarios: [],
      favoriteScenarioIds: [],
      wins: [],
      remoteReady: false,

      finishOnboarding: (name) =>
        set({ onboardingDone: true, name: name.trim() || 'друг' }),

      setName: (name) => {
        set({ name });
        void api.saveMe({ name });
      },

      setSettings: (patch) => {
        set((s) => {
          const settings = { ...s.settings, ...patch };
          void api.saveMe({ settings });
          return { settings };
        });
      },

      setReminders: (patch) => {
        get().setSettings({
          reminders: { ...get().settings.reminders, ...patch },
        });
      },

      setEnergy: (e) => set({ energy: e }),

      addCustomScenario: (input) => {
        const scenario: CustomScenario = {
          id: uid(),
          emoji: input.emoji,
          title: input.title,
          categoryId: input.categoryId,
          energy: input.energy,
          minutes: input.minutes,
          steps: input.steps,
          createdAt: new Date().toISOString(),
        };
        set((s) => {
          const customScenarios = [scenario, ...s.customScenarios];
          void api.saveMe({ customScenarios });
          return { customScenarios };
        });
        return scenario;
      },

      deleteCustomScenario: (id) => {
        set((s) => {
          const customScenarios = s.customScenarios.filter((c) => c.id !== id);
          void api.saveMe({ customScenarios });
          return { customScenarios };
        });
      },

      toggleFavorite: (scenarioId) => {
        set((s) => {
          const exists = s.favoriteScenarioIds.includes(scenarioId);
          const favoriteScenarioIds = exists
            ? s.favoriteScenarioIds.filter((id) => id !== scenarioId)
            : [...s.favoriteScenarioIds, scenarioId];
          void api.saveMe({ favoriteScenarioIds });
          return { favoriteScenarioIds };
        });
      },

      recordWin: (input) => {
        const win: WinRecord = {
          id: uid(),
          scenarioId: input.scenarioId,
          familyId: input.familyId,
          title: input.title,
          categoryId: input.categoryId,
          emoji: input.emoji,
          stepsDone: input.stepsDone,
          stepsTotal: input.stepsTotal,
          completedAt: new Date().toISOString(),
        };
        set((s) => ({ wins: [win, ...s.wins] }));
        void api.addWin({
          scenarioId: win.scenarioId,
          familyId: win.familyId,
          title: win.title,
          categoryId: win.categoryId,
          emoji: win.emoji,
          stepsDone: win.stepsDone,
          stepsTotal: win.stepsTotal,
        });
      },

      hydrateFromRemote: async () => {
        if (get().remoteReady) return;
        set({ remoteReady: true });
        const remote = await api.me();
        if (!remote) return;
        set((s) => {
          const merged: Partial<ShazhokState> = {};
          // Имя: если локально не знакомились — берём из бэкенда.
          if (!s.onboardingDone && remote.name) {
            merged.onboardingDone = true;
            merged.name = remote.name;
          }
          // Настройки: если пользователь ещё ничего не менял локально —
          // берём удалённые (важно для напоминаний с другого устройства).
          const localIsDefault =
            JSON.stringify(s.settings) === JSON.stringify(DEFAULT_SETTINGS);
          merged.settings = localIsDefault
            ? remote.settings
            : { ...remote.settings, ...s.settings };
          if (s.customScenarios.length === 0 && remote.customScenarios.length > 0) {
            merged.customScenarios = remote.customScenarios;
          }
          if (s.favoriteScenarioIds.length === 0 && remote.favoriteScenarioIds.length > 0) {
            merged.favoriteScenarioIds = remote.favoriteScenarioIds;
          }
          // История: объединяем локальную и удалённую, без дублей.
          const ids = new Set(s.wins.map((w) => w.id));
          const remoteWins = remote.wins.filter((w) => !ids.has(w.id));
          merged.wins = [...remoteWins, ...s.wins];
          return merged;
        });
      },

      clearAll: () => {
        set({
          onboardingDone: false,
          name: '',
          settings: DEFAULT_SETTINGS,
          energy: null,
          customScenarios: [],
          favoriteScenarioIds: [],
          wins: [],
          remoteReady: false,
        });
      },
    }),
    {
      name: 'shazhok-storage',
      version: 1,
      partialize: (state) => ({
        onboardingDone: state.onboardingDone,
        name: state.name,
        settings: state.settings,
        energy: state.energy,
        customScenarios: state.customScenarios,
        favoriteScenarioIds: state.favoriteScenarioIds,
        wins: state.wins,
      }),
    }
  )
);

/** Превращает произвольный сценарий (библиотечный или свой) в общий вид. */
export interface DisplayScenario {
  id: string;
  familyId: string;
  categoryId: string;
  emoji: string;
  title: string;
  description?: string;
  energy: EnergyLevel;
  minutes: string;
  steps: ScenarioStep[];
  gentleNote?: string;
  isCustom: boolean;
}

export function toDisplay(scenario: Scenario, isCustom = false): DisplayScenario {
  return { ...scenario, isCustom };
}

export function customToDisplay(c: CustomScenario): DisplayScenario {
  return {
    id: c.id,
    familyId: c.id,
    categoryId: c.categoryId,
    emoji: c.emoji,
    title: c.title,
    energy: c.energy,
    minutes: c.minutes,
    steps: c.steps,
    isCustom: true,
  };
}

/** Сумма действий за последние N дней (включительно с сегодня). */
export function winsLastDays(wins: WinRecord[], days: number): WinRecord[] {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));
  return wins.filter((w) => new Date(w.completedAt).getTime() >= since.getTime());
}
