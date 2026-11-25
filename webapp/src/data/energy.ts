import type { EnergyLevel } from '../types';

export interface EnergyMeta {
  id: EnergyLevel;
  emoji: string;
  title: string;
  /** Короткая строка-состояние. */
  tagline: string;
  description: string;
  examples: string[];
}

export const ENERGY_LEVELS: EnergyMeta[] = [
  {
    id: 'low',
    emoji: '☁️',
    title: 'Совсем мало',
    tagline: 'Хочу просто пережить день',
    description: 'На сложные дела нет ресурсов. Подберём самое лёгкое действие.',
    examples: [
      'Выбросить мусор со стола',
      'Поставить стакан воды рядом',
      'Убрать одну тарелку',
      'Подготовить одежду на завтра',
    ],
  },
  {
    id: 'medium',
    emoji: '🌤️',
    title: 'Немного сил',
    tagline: 'Могу что-то небольшое',
    description: 'Сделаем одно небольшое дело, если не перегружать себя.',
    examples: [
      'Помыть посуду из раковины',
      'Разобрать одну полку',
      'Запустить стирку',
      'Приготовить простой обед',
    ],
  },
  {
    id: 'high',
    emoji: '☀️',
    title: 'Много сил',
    tagline: 'Чувствую себя хорошо',
    description: 'Сегодня можно заняться несколькими делами.',
    examples: [
      'Полностью убрать кухню',
      'Разобрать шкаф',
      'Приготовить несколько блюд',
      'Сделать небольшую уборку',
    ],
  },
];

export const DONT_KNOW: EnergyMeta = {
  id: 'medium',
  emoji: '🌫️',
  title: 'Не знаю',
  tagline: 'Помоги определиться',
  description: 'Предложим что-то очень лёгкое — от него можно оттолкнуться.',
  examples: ['Попробовать одно очень маленькое действие'],
};

export function energyById(id: EnergyLevel): EnergyMeta {
  return ENERGY_LEVELS.find((e) => e.id === id) ?? ENERGY_LEVELS[1];
}
