import type { EnergyLevel, Scenario } from '../types';

export const RANK_ENERGY: Record<EnergyLevel, number> = { low: 1, medium: 2, high: 3 };

/**
 * Библиотека бытовых сценариев.
 * Каждая «семья» (familyId) объединяет варианты одной задачи под разные
 * уровни энергии: low = совсем мало, medium = немного, high = много.
 * Инструкции намеренно короткие и конкретные — минимум неопределённости.
 */
export const SCENARIOS: Scenario[] = [
  // ─────────────── Кухня ───────────────
  {
    id: 'dishes-low',
    familyId: 'dishes',
    categoryId: 'kitchen',
    emoji: '🍽️',
    title: 'Убрать одну тарелку',
    description: 'Собрать грязные тарелки и поставить их в раковину или посудомойку.',
    energy: 'low',
    minutes: '1 мин',
    steps: [
      { emoji: '🍽️', title: 'Найди одну грязную тарелку', text: 'Любую. Не нужно собирать всё.' },
      { emoji: '🚰', title: 'Поставь её в раковину или посудомойку', text: 'Мыть пока не обязательно.' },
    ],
    gentleNote: 'Одна тарелка — уже шаг. Этого достаточно.',
  },
  {
    id: 'dishes-med',
    familyId: 'dishes',
    categoryId: 'kitchen',
    emoji: '🧽',
    title: 'Помыть посуду из раковины',
    description: 'Собрать грязную посуду и помыть то, что лежит в раковине.',
    energy: 'medium',
    minutes: '10 мин',
    steps: [
      { emoji: '🍽️', title: 'Собери грязную посуду', text: 'Поставь её около раковины. Пока ничего не мой.' },
      { emoji: '💧', title: 'Наполни раковину тёплой водой', text: 'Добавь немного средства.' },
      { emoji: '🧽', title: 'Помой посуду', text: 'Двигайся в своём темпе. Не обязательно делать всё идеально.' },
      { emoji: '🧻', title: 'Ополосни и поставь сушиться', text: 'Или вытри полотенцем — как удобнее.' },
    ],
    gentleNote: 'Можно остановиться в любой момент. Даже половина — результат.',
  },
  {
    id: 'dishes-high',
    familyId: 'dishes',
    categoryId: 'kitchen',
    emoji: '✨',
    title: 'Помыть и убрать всю посуду',
    description: 'Помыть посуду и убрать её по местам.',
    energy: 'high',
    minutes: '20 мин',
    steps: [
      { emoji: '🍽️', title: 'Собери всю грязную посуду', text: 'Собери со стола и рабочих поверхностей.' },
      { emoji: '🧽', title: 'Помой посуду', text: 'Тарелки, чашки, столовые приборы, кастрюли.' },
      { emoji: '🧻', title: 'Вытри или дай высохнуть' },
      { emoji: '🗄️', title: 'Убери чистую посуду по местам' },
      { emoji: '🧼', title: 'Протри раковину', text: 'Быстро, одной салфеткой.' },
    ],
    gentleNote: 'Готово. Кухня стала заметно свободнее.',
  },
  {
    id: 'surface-low',
    familyId: 'surface',
    categoryId: 'kitchen',
    emoji: '🧻',
    title: 'Протереть один стол',
    description: 'Убрать крошки и протереть одну поверхность.',
    energy: 'low',
    minutes: '2 мин',
    steps: [
      { emoji: '🧻', title: 'Возьми салфетку или тряпку' },
      { emoji: '🪑', title: 'Убери крошки со стола', text: 'Смахни их в ладонь или на салфетку.' },
      { emoji: '🧽', title: 'Протри поверхность', text: 'Одного-двух движений достаточно.' },
    ],
    gentleNote: 'Чистый стол — маленький островок порядка.',
  },
  {
    id: 'fridge-med',
    familyId: 'fridge',
    categoryId: 'kitchen',
    emoji: '🧊',
    title: 'Разобрать одну полку холодильника',
    description: 'Выбросить испорченное и протереть одну полку.',
    energy: 'medium',
    minutes: '10 мин',
    steps: [
      { emoji: '🧊', title: 'Выбери одну полку', text: 'Только одну. Остальное не трогаем.' },
      { emoji: '🗑️', title: 'Выброси испорченное', text: 'Всё, что испортилось или просрочено.' },
      { emoji: '🧻', title: 'Протри полку', text: 'Влажной салфеткой.' },
      { emoji: '🧃', title: 'Верни продукты на место' },
    ],
    gentleNote: 'Одна полка — этого достаточно на сегодня.',
  },
  {
    id: 'fridge-high',
    familyId: 'fridge',
    categoryId: 'kitchen',
    emoji: '🧊',
    title: 'Разобрать весь холодильник',
    description: 'Выбросить лишнее, протереть полки, навести порядок.',
    energy: 'high',
    minutes: '25 мин',
    steps: [
      { emoji: '🧊', title: 'Выброси испорченное', text: 'Пройдись по всем полкам и дверце.' },
      { emoji: '🧻', title: 'Протри полки и стенки' },
      { emoji: '🗂️', title: 'Разложи продукты по группам', text: 'Молочное вместе, овощи вместе.' },
      { emoji: '📝', title: 'Запиши, что закончилось', text: 'Пригодится для списка покупок.' },
    ],
    gentleNote: 'Холодильник снова понятный.',
  },

  // ─────────────── Уборка ───────────────
  {
    id: 'trash-low',
    familyId: 'trash',
    categoryId: 'cleaning',
    emoji: '🗑️',
    title: 'Выбросить мусор со стола',
    description: 'Собрать мелкий мусор с одной поверхности в пакет.',
    energy: 'low',
    minutes: '2 мин',
    steps: [
      { emoji: '🗑️', title: 'Возьми пакет или мусорку' },
      { emoji: '🧻', title: 'Собери мусор со стола', text: 'Фантики, салфетки, крошки.' },
      { emoji: '🚮', title: 'Выброси пакет', text: 'Если мусорка рядом — просто донеси.' },
    ],
    gentleNote: 'Маленький порядок — тоже порядок.',
  },
  {
    id: 'dust-med',
    familyId: 'dust',
    categoryId: 'cleaning',
    emoji: '🧹',
    title: 'Протереть пыль на одной поверхности',
    description: 'Протереть одну полку, тумбочку или подоконник.',
    energy: 'medium',
    minutes: '5 мин',
    steps: [
      { emoji: '🧻', title: 'Возьми влажную салфетку' },
      { emoji: '🪑', title: 'Убери вещи с поверхности', text: 'Поставь их рядом.' },
      { emoji: '🧽', title: 'Протри поверхность' },
      { emoji: '📦', title: 'Верни вещи на место' },
    ],
    gentleNote: 'Одна чистая поверхность — уже легче дышится.',
  },
  {
    id: 'vacuum-med',
    familyId: 'vacuum',
    categoryId: 'cleaning',
    emoji: '🛋️',
    title: 'Пропылесосить одну комнату',
    description: 'Пропылесосить пол в одной комнате, без фанатизма.',
    energy: 'medium',
    minutes: '15 мин',
    steps: [
      { emoji: '🔌', title: 'Достань пылесос', text: 'И воткни в розетку.' },
      { emoji: '🧸', title: 'Убери крупное с пола', text: 'То, что мешает проехать.' },
      { emoji: '🧹', title: 'Пропылесось комнату', text: 'Основные проходы. Углы — по желанию.' },
      { emoji: '🔌', title: 'Убери пылесос' },
    ],
    gentleNote: 'Чистый пол — приятно.',
  },
  {
    id: 'clutter-med',
    familyId: 'clutter',
    categoryId: 'cleaning',
    emoji: '🧺',
    title: 'Собрать разбросанные вещи в корзину',
    description: 'Сложить разбросанные вещи в одну корзину или кучу.',
    energy: 'medium',
    minutes: '10 мин',
    steps: [
      { emoji: '🧺', title: 'Возьми корзину или большую сумку' },
      { emoji: '👕', title: 'Собери вещи с пола и стульев', text: 'Одежду, полотенца, мелкие предметы.' },
      { emoji: '📍', title: 'Поставь корзину на место' },
    ],
    gentleNote: 'Теперь вещи в одном месте, а не везде.',
  },
  {
    id: 'room-high',
    familyId: 'room',
    categoryId: 'cleaning',
    emoji: '🏠',
    title: 'Небольшая уборка комнаты',
    description: 'Собрать вещи, протереть поверхности и пропылесосить.',
    energy: 'high',
    minutes: '30 мин',
    steps: [
      { emoji: '🧺', title: 'Собери вещи по местам', text: 'Или в корзину — как быстрее.' },
      { emoji: '🧻', title: 'Протри основные поверхности' },
      { emoji: '🧹', title: 'Пропылесось пол' },
      { emoji: '🗑️', title: 'Выброси мусор' },
    ],
    gentleNote: 'Комната готова. Спасибо себе за это.',
  },

  // ─────────────── Стирка ───────────────
  {
    id: 'laundry-start-med',
    familyId: 'laundry-start',
    categoryId: 'laundry',
    emoji: '🧺',
    title: 'Запустить стирку',
    description: 'Собрать вещи, загрузить машину и запустить цикл.',
    energy: 'medium',
    minutes: '10 мин',
    steps: [
      { emoji: '🧺', title: 'Собери грязное бельё', text: 'В одну кучу или корзину.' },
      { emoji: '🔍', title: 'Проверь карманы' },
      { emoji: '🛁', title: 'Загрузи машину', text: 'Не переполняй — вещи должны свободно лежать.' },
      { emoji: '🧴', title: 'Добавь средство и запусти', text: 'Обычный режим подойдёт.' },
    ],
    gentleNote: 'Стирка идёт, а ты можешь отдыхать.',
  },
  {
    id: 'laundry-hang-med',
    familyId: 'laundry-hang',
    categoryId: 'laundry',
    emoji: '🧺',
    title: 'Развесить бельё',
    description: 'Достать вещи из машины и развесить сушиться.',
    energy: 'medium',
    minutes: '10 мин',
    steps: [
      { emoji: '🛁', title: 'Достань вещи из машины' },
      { emoji: '👕', title: 'Встряхни каждую вещь', text: 'Так будет меньше складок.' },
      { emoji: '🌬️', title: 'Развесь сушиться' },
    ],
    gentleNote: 'Дальше одежда высохнет сама.',
  },
  {
    id: 'socks-low',
    familyId: 'fold',
    categoryId: 'laundry',
    emoji: '🧦',
    title: 'Сложить одну стопку носков',
    description: 'Найти пары носков и сложить их вместе.',
    energy: 'low',
    minutes: '5 мин',
    steps: [
      { emoji: '🧦', title: 'Найди носки', text: 'Только носки. Остальное не трогаем.' },
      { emoji: '🫧', title: 'Разложи по парам' },
      { emoji: '📦', title: 'Сложи пары в стопку' },
    ],
    gentleNote: 'Пара носков — тоже победа.',
  },
  {
    id: 'fold-med',
    familyId: 'fold',
    categoryId: 'laundry',
    emoji: '👕',
    title: 'Разобрать чистую одежду',
    description: 'Сложить чистую одежду и убрать по местам.',
    energy: 'medium',
    minutes: '15 мин',
    steps: [
      { emoji: '🧺', title: 'Возьми кучу чистой одежды' },
      { emoji: '👕', title: 'Сложи вещи', text: 'По одной. Не нужно идеально.' },
      { emoji: '🗄️', title: 'Убери в шкаф или ящики' },
    ],
    gentleNote: 'Чистая одежда на месте — приятно.',
  },
  {
    id: 'bed-high',
    familyId: 'bed',
    categoryId: 'laundry',
    emoji: '🛏️',
    title: 'Сменить постель',
    description: 'Снять и надеть чистое постельное бельё.',
    energy: 'high',
    minutes: '20 мин',
    steps: [
      { emoji: '🛏️', title: 'Сними старое бельё', text: 'Наволочки, простыню, пододеяльник.' },
      { emoji: '🧺', title: 'Отнеси в стирку', text: 'Или в корзину для белья.' },
      { emoji: '🛏️', title: 'Надень чистое бельё' },
      { emoji: '🧸', title: 'Заправь одеяло и подушки' },
    ],
    gentleNote: 'Свежая постель — подарок себе на ночь.',
  },

  // ─────────────── Гигиена ───────────────
  {
    id: 'teeth-low',
    familyId: 'teeth',
    categoryId: 'hygiene',
    emoji: '🪥',
    title: 'Почистить зубы',
    description: 'Почистить зубы в удобном темпе.',
    energy: 'low',
    minutes: '3 мин',
    steps: [
      { emoji: '🪥', title: 'Нанеси пасту на щётку' },
      { emoji: '😁', title: 'Почисти зубы', text: 'Хотя бы 30 секунд — уже хорошо.' },
      { emoji: '💧', title: 'Прополощи рот' },
    ],
    gentleNote: 'Готово. Свежее ощущение.',
  },
  {
    id: 'wash-low',
    familyId: 'wash',
    categoryId: 'hygiene',
    emoji: '💦',
    title: 'Умыться',
    description: 'Умыть лицо прохладной водой.',
    energy: 'low',
    minutes: '2 мин',
    steps: [
      { emoji: '💦', title: 'Смочи лицо водой' },
      { emoji: '🧼', title: 'Умойся с мылом или гелем', text: 'Если есть силы — без него тоже ок.' },
      { emoji: '🧻', title: 'Промокни лицо полотенцем' },
    ],
    gentleNote: 'Стало немного свежее.',
  },
  {
    id: 'shower-med',
    familyId: 'shower',
    categoryId: 'hygiene',
    emoji: '🚿',
    title: 'Принять душ',
    description: 'Быстрый душ, чтобы почувствовать себя лучше.',
    energy: 'medium',
    minutes: '15 мин',
    steps: [
      { emoji: '🧺', title: 'Подготовь полотенце и чистую одежду' },
      { emoji: '🚿', title: 'Включи воду комфортной температуры' },
      { emoji: '🧼', title: 'Помойся', text: 'В удобном темпе.' },
      { emoji: '👕', title: 'Вытрись и оденься' },
    ],
    gentleNote: 'Душ может освежить сильнее, чем кажется.',
  },
  {
    id: 'change-low',
    familyId: 'change',
    categoryId: 'hygiene',
    emoji: '👕',
    title: 'Сменить одежду',
    description: 'Надеть чистую и удобную одежду.',
    energy: 'low',
    minutes: '5 мин',
    steps: [
      { emoji: '👕', title: 'Найди чистую одежду', text: 'Любую удобную.' },
      { emoji: '🔄', title: 'Переоденься' },
      { emoji: '🧺', title: 'Убери старую одежду', text: 'В стирку или на стул — как проще.' },
    ],
    gentleNote: 'Чистая одежда — маленькая забота о себе.',
  },
  {
    id: 'shower-high',
    familyId: 'shower',
    categoryId: 'hygiene',
    emoji: '🛁',
    title: 'Полный уход за собой',
    description: 'Душ, волосы и крем — без спешки.',
    energy: 'high',
    minutes: '30 мин',
    steps: [
      { emoji: '🚿', title: 'Прими душ', text: 'С волосами, если нужно.' },
      { emoji: '🧴', title: 'Нанеси крем или лосьон' },
      { emoji: '👕', title: 'Оденься в чистое' },
      { emoji: '🪞', title: 'Сделай то, что радует', text: 'Расчеши волосы, побрейся — по желанию.' },
    ],
    gentleNote: 'Полный уход — заслуженный.',
  },

  // ─────────────── Еда ───────────────
  {
    id: 'water-low',
    familyId: 'water',
    categoryId: 'food',
    emoji: '🥤',
    title: 'Поставить стакан воды рядом',
    description: 'Налить стакан воды и поставить рядом с собой.',
    energy: 'low',
    minutes: '1 мин',
    steps: [
      { emoji: '🥤', title: 'Возьми стакан или бутылку' },
      { emoji: '💧', title: 'Налей воды' },
      { emoji: '📍', title: 'Поставь рядом с собой' },
    ],
    gentleNote: 'Вода рядом — уже забота.',
  },
  {
    id: 'snack-low',
    familyId: 'snack',
    categoryId: 'food',
    emoji: '🍞',
    title: 'Приготовить простой перекус',
    description: 'Собрать что-нибудь простое, чтобы поесть.',
    energy: 'low',
    minutes: '5 мин',
    steps: [
      { emoji: '🔍', title: 'Найди что-то готовое', text: 'Хлеб, сыр, фрукт, йогурт.' },
      { emoji: '🍽️', title: 'Собери перекус', text: 'Не нужно готовить, просто сложи.' },
      { emoji: '🪑', title: 'Сядь и поешь', text: 'Не на бегу, если можешь.' },
    ],
    gentleNote: 'Поесть — это тоже забота о себе.',
  },
  {
    id: 'breakfast-med',
    familyId: 'breakfast',
    categoryId: 'food',
    emoji: '🍳',
    title: 'Приготовить завтрак',
    description: 'Простой завтрак без сложных рецептов.',
    energy: 'medium',
    minutes: '10 мин',
    steps: [
      { emoji: '🍳', title: 'Выбери простой вариант', text: 'Каша, яичница, тост, бутерброд.' },
      { emoji: '🔪', title: 'Подготовь продукты' },
      { emoji: '🍳', title: 'Приготовь' },
      { emoji: '🍽️', title: 'Поешь' },
    ],
    gentleNote: 'Завтрак готов. Хороший старт.',
  },
  {
    id: 'lunch-med',
    familyId: 'lunch',
    categoryId: 'food',
    emoji: '🥣',
    title: 'Приготовить простой обед',
    description: 'Одно блюдо, которое не требует много сил.',
    energy: 'medium',
    minutes: '20 мин',
    steps: [
      { emoji: '🥣', title: 'Выбери одно простое блюдо', text: 'Суп, паста, каша с добавкой.' },
      { emoji: '🔪', title: 'Подготовь продукты' },
      { emoji: '🍳', title: 'Приготовь' },
      { emoji: '🍽️', title: 'Поешь', text: 'И убери минимум посуды.' },
    ],
    gentleNote: 'Одно горячее блюдо — уже много.',
  },
  {
    id: 'cook-high',
    familyId: 'cook',
    categoryId: 'food',
    emoji: '🍲',
    title: 'Приготовить несколько блюд',
    description: 'Приготовить запас еды на несколько приёмов.',
    energy: 'high',
    minutes: '45 мин',
    steps: [
      { emoji: '📝', title: 'Выбери 2–3 простых блюда' },
      { emoji: '🔪', title: 'Подготовь все продукты', text: 'Нарежь заранее.' },
      { emoji: '🍳', title: 'Приготовь по очереди' },
      { emoji: '🥡', title: 'Разложи по контейнерам', text: 'Часть — в холодильник на потом.' },
    ],
    gentleNote: 'Несколько блюд — запас на пару дней вперёд.',
  },

  // ─────────────── Покупки ───────────────
  {
    id: 'list-low',
    familyId: 'list',
    categoryId: 'shopping',
    emoji: '📝',
    title: 'Написать список на 3 продукта',
    description: 'Записать три продукта, которые заканчиваются.',
    energy: 'low',
    minutes: '3 мин',
    steps: [
      { emoji: '📝', title: 'Открой заметки или возьми листок' },
      { emoji: '🧊', title: 'Вспомни 3 продукта', text: 'Что заканчивается? Что хочется?' },
      { emoji: '✅', title: 'Запиши их' },
    ],
    gentleNote: 'Список готов — остальное потом.',
  },
  {
    id: 'fridge-check-med',
    familyId: 'fridge-check',
    categoryId: 'shopping',
    emoji: '🧊',
    title: 'Проверить, есть ли дома продукты',
    description: 'Заглянуть в холодильник и отметить, что заканчивается.',
    energy: 'medium',
    minutes: '5 мин',
    steps: [
      { emoji: '🧊', title: 'Открой холодильник' },
      { emoji: '👀', title: 'Проверь основные продукты', text: 'Хлеб, молоко, яйца, что обычно ешь.' },
      { emoji: '📝', title: 'Запиши, что закончилось' },
    ],
    gentleNote: 'Теперь понятно, что нужно купить.',
  },
  {
    id: 'shop-med',
    familyId: 'shop',
    categoryId: 'shopping',
    emoji: '🛒',
    title: 'Сходить в магазин по списку',
    description: 'Купить продукты по списку.',
    energy: 'medium',
    minutes: '40 мин',
    steps: [
      { emoji: '📝', title: 'Возьми список и сумку' },
      { emoji: '🚪', title: 'Дойди до магазина' },
      { emoji: '🛒', title: 'Купи по списку', text: 'Если что-то забыл(а) — не страшно.' },
      { emoji: '🏠', title: 'Вернись домой' },
    ],
    gentleNote: 'Продукты дома — это уже много.',
  },
  {
    id: 'unpack-med',
    familyId: 'unpack',
    categoryId: 'shopping',
    emoji: '📦',
    title: 'Разобрать покупки',
    description: 'Разложить купленное по местам.',
    energy: 'medium',
    minutes: '10 мин',
    steps: [
      { emoji: '📦', title: 'Достань всё из пакетов' },
      { emoji: '🧊', title: 'Убери в холодильник', text: 'Всё, что нужно хранить в холоде.' },
      { emoji: '🗄️', title: 'Разложи остальное по местам' },
    ],
    gentleNote: 'Покупки на месте — порядок восстановлен.',
  },

  // ─────────────── Документы ───────────────
  {
    id: 'mail-low',
    familyId: 'mail',
    categoryId: 'documents',
    emoji: '✉️',
    title: 'Разобрать 3 письма',
    description: 'Открыть и разобрать три письма или уведомления.',
    energy: 'low',
    minutes: '5 мин',
    steps: [
      { emoji: '✉️', title: 'Открой почту', text: 'Только входящие, только три письма.' },
      { emoji: '👀', title: 'Просмотри их', text: 'Важное отметь, остальное — по желанию.' },
      { emoji: '🗑️', title: 'Удали или отложи лишнее' },
    ],
    gentleNote: 'Три письма — уже легче.',
  },
  {
    id: 'bill-med',
    familyId: 'bill',
    categoryId: 'documents',
    emoji: '🧾',
    title: 'Оплатить один счёт',
    description: 'Найти и оплатить один счёт.',
    energy: 'medium',
    minutes: '10 мин',
    steps: [
      { emoji: '🧾', title: 'Найди один счёт', text: 'Любой, который висит.' },
      { emoji: '🔍', title: 'Открой его' },
      { emoji: '💳', title: 'Оплати' },
      { emoji: '✅', title: 'Отметь, что оплачено' },
    ],
    gentleNote: 'Один счёт меньше — уже спокойнее.',
  },
  {
    id: 'papers-med',
    familyId: 'papers',
    categoryId: 'documents',
    emoji: '📄',
    title: 'Сложить бумаги в одну папку',
    description: 'Собрать разрозненные бумаги в одно место.',
    energy: 'medium',
    minutes: '15 мин',
    steps: [
      { emoji: '📄', title: 'Собери бумаги в одну кучу', text: 'Со всех поверхностей.' },
      { emoji: '🗂️', title: 'Разложи на «важное» и «остальное»' },
      { emoji: '📁', title: 'Сложи в папку или конверт' },
    ],
    gentleNote: 'Бумаги теперь в одном месте.',
  },

  // ─────────────── Подготовка ───────────────
  {
    id: 'sleep-med',
    familyId: 'sleep',
    categoryId: 'prep',
    emoji: '😴',
    title: 'Подготовиться ко сну',
    description: 'Небольшая вечерняя рутина для спокойного сна.',
    energy: 'medium',
    minutes: '10 мин',
    steps: [
      { emoji: '🪥', title: 'Почисти зубы' },
      { emoji: '👕', title: 'Надень одежду для сна' },
      { emoji: '📵', title: 'Убери телефон подальше', text: 'Хотя бы на тумбочку экраном вниз.' },
      { emoji: '🛏️', title: 'Ляг в постель' },
    ],
    gentleNote: 'Спокойной ночи. Завтра будет новый день.',
  },
  {
    id: 'morning-med',
    familyId: 'morning',
    categoryId: 'prep',
    emoji: '🌅',
    title: 'Подготовиться к утру',
    description: 'Сделать утро завтрашнего дня чуть легче.',
    energy: 'medium',
    minutes: '10 мин',
    steps: [
      { emoji: '👕', title: 'Подготовь одежду на завтра' },
      { emoji: '🎒', title: 'Собери сумку', text: 'Ключи, документы, зарядка.' },
      { emoji: '🍞', title: 'Подготовь завтрак', text: 'Или хотя бы поставь продукты на видное место.' },
    ],
    gentleNote: 'Завтрашний «ты» скажет спасибо.',
  },
  {
    id: 'leave-med',
    familyId: 'leave',
    categoryId: 'prep',
    emoji: '🎒',
    title: 'Собраться из дома',
    description: 'Собрать всё нужное перед выходом.',
    energy: 'medium',
    minutes: '15 мин',
    steps: [
      { emoji: '🔑', title: 'Ключи, телефон, кошелёк', text: 'Проверь три главные вещи.' },
      { emoji: '🎒', title: 'Собери сумку' },
      { emoji: '👟', title: 'Оденься по погоде' },
      { emoji: '🚪', title: 'Проверь дверь и свет', text: 'И выходи.' },
    ],
    gentleNote: 'Всё на месте. Можно выходить.',
  },
  {
    id: 'workday-high',
    familyId: 'workday',
    categoryId: 'prep',
    emoji: '💼',
    title: 'Подготовиться к рабочему дню',
    description: 'Полная подготовка к завтрашнему дню.',
    energy: 'high',
    minutes: '20 мин',
    steps: [
      { emoji: '👕', title: 'Подготовь одежду' },
      { emoji: '🎒', title: 'Собери сумку и документы' },
      { emoji: '🍱', title: 'Подготовь еду с собой', text: 'Если берёшь.' },
      { emoji: '📝', title: 'Напиши 1–2 главных дела на завтра' },
    ],
    gentleNote: 'Завтра начнётся спокойнее.',
  },

  // ─────────────── Восстановиться ───────────────
  {
    id: 'recover-water',
    familyId: 'recover-water',
    categoryId: 'recover',
    emoji: '🥛',
    title: 'Выпить воды',
    description: 'Сделать несколько глотков воды.',
    energy: 'low',
    minutes: '1 мин',
    steps: [
      { emoji: '🥛', title: 'Налей или возьми воду' },
      { emoji: '💧', title: 'Сделай несколько глотков', text: 'Столько, сколько комфортно.' },
    ],
    gentleNote: 'Иногда этого достаточно, чтобы стало чуть легче.',
  },
  {
    id: 'recover-sit',
    familyId: 'recover-sit',
    categoryId: 'recover',
    emoji: '🪑',
    title: 'Найти удобное положение',
    description: 'Поменять позу на более удобную.',
    energy: 'low',
    minutes: '1 мин',
    steps: [
      { emoji: '🪑', title: 'Поправь позу', text: 'Спина, ноги, плечи — как удобнее.' },
      { emoji: '🧸', title: 'Подложи подушку или плед', text: 'Если есть под рукой.' },
    ],
    gentleNote: 'Тело заслуживает удобства.',
  },
  {
    id: 'recover-light',
    familyId: 'recover-light',
    categoryId: 'recover',
    emoji: '💡',
    title: 'Уменьшить яркость света',
    description: 'Приглушить свет, если он раздражает.',
    energy: 'low',
    minutes: '1 мин',
    steps: [
      { emoji: '💡', title: 'Выключи верхний свет', text: 'Или приглуши.' },
      { emoji: '🕯️', title: 'Оставь мягкий свет', text: 'Ночник или лампа.' },
    ],
    gentleNote: 'Меньше света — меньше перегрузки.',
  },
  {
    id: 'recover-quiet',
    familyId: 'recover-quiet',
    categoryId: 'recover',
    emoji: '🤫',
    title: 'Перейти в более тихое место',
    description: 'Найти место потише или приглушить звуки.',
    energy: 'low',
    minutes: '1 мин',
    steps: [
      { emoji: '🤫', title: 'Уменьши шум', text: 'Закрой дверь, выключи лишние звуки.' },
      { emoji: '🎧', title: 'Надень наушники', text: 'Или просто побудь в тишине.' },
    ],
    gentleNote: 'Тишина помогает перезагрузиться.',
  },
  {
    id: 'recover-allow',
    familyId: 'recover-allow',
    categoryId: 'recover',
    emoji: '🌱',
    title: 'Разрешить себе отложить необязательные дела',
    description: 'Снять с себя лишнее на сегодня.',
    energy: 'low',
    minutes: '1 мин',
    steps: [
      { emoji: '🌱', title: 'Назови одно необязательное дело', text: 'То, что можно отложить.' },
      { emoji: '🗓️', title: 'Скажи себе: «Это подождёт»', text: 'Это не лень, это забота о себе.' },
      { emoji: '😌', title: 'Выдохни' },
    ],
    gentleNote: 'Ты не обязан(а) успевать всё.',
  },
];

// ─────────────── Хелперы ───────────────

export function scenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function scenariosByCategory(categoryId: string): Scenario[] {
  return SCENARIOS.filter((s) => s.categoryId === categoryId);
}

/**
 * Сценарии, посильные для выбранного уровня: сначала точное совпадение,
 * затем более лёгкие варианты (чтобы «Немного» и «Много» всегда имели запас).
 */
export function scenariosForEnergy(
  categoryId: string,
  energy: EnergyLevel
): Scenario[] {
  const rank = RANK_ENERGY[energy];
  return scenariosByCategory(categoryId)
    .filter((s) => RANK_ENERGY[s.energy] <= rank)
    .sort((a, b) => RANK_ENERGY[b.energy] - RANK_ENERGY[a.energy]);
}

/** Один случайный подходящий сценарий (сначала точного уровня). */
export function pickForMe(categoryId: string, energy: EnergyLevel): Scenario {
  const list = scenariosForEnergy(categoryId, energy);
  if (list.length === 0) return scenariosByCategory(categoryId)[0];
  const exact = list.filter((s) => s.energy === energy);
  const pool = exact.length > 0 ? exact : list;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** «Выбери за меня» по всем категориям: случайное посильное действие. */
export function surpriseMe(energy: EnergyLevel): Scenario {
  const rank = RANK_ENERGY[energy];
  const feasible = SCENARIOS.filter((s) => RANK_ENERGY[s.energy] <= rank);
  const exact = feasible.filter((s) => s.energy === energy);
  const pool = exact.length > 0 ? exact : feasible;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Для режима «Не знаю, с чего начать»: очень лёгкое действие по ответу. */
export const START_HERE_OPTIONS: {
  id: string;
  emoji: string;
  label: string;
  scenarioId: string;
}[] = [
  { id: 'mess', emoji: '🧺', label: 'Вокруг слишком много беспорядка', scenarioId: 'trash-low' },
  { id: 'hungry', emoji: '🥪', label: 'Я давно не ел(а)', scenarioId: 'snack-low' },
  { id: 'tomorrow', emoji: '🌅', label: 'Нужно подготовиться к завтрашнему дню', scenarioId: 'morning-med' },
  { id: 'behind', emoji: '🌫️', label: 'Я ничего не успеваю', scenarioId: 'recover-allow' },
  { id: 'anything', emoji: '✨', label: 'Хочу сделать хоть что-нибудь', scenarioId: 'water-low' },
];
