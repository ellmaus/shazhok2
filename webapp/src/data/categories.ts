import type { Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'kitchen', emoji: '🍽️', name: 'Кухня', subtitle: 'Посуда, еда, уборка' },
  { id: 'cleaning', emoji: '🧹', name: 'Уборка', subtitle: 'Порядок, поверхности, мусор' },
  { id: 'laundry', emoji: '🧺', name: 'Стирка', subtitle: 'Одежда, бельё, вещи' },
  { id: 'hygiene', emoji: '🚿', name: 'Гигиена', subtitle: 'Уход за собой, ванная' },
  { id: 'food', emoji: '🥪', name: 'Еда', subtitle: 'Приготовление, перекус' },
  { id: 'shopping', emoji: '🛒', name: 'Покупки', subtitle: 'Список, магазин, продукты' },
  { id: 'documents', emoji: '📄', name: 'Документы', subtitle: 'Почта, счета, бумаги' },
  { id: 'prep', emoji: '🎒', name: 'Подготовка', subtitle: 'Сборы, утро, сон' },
  { id: 'recover', emoji: '🌱', name: 'Восстановиться', subtitle: 'Пауза и самоподдержка' },
];

export function categoryById(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}
