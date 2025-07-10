export interface Category {
  slug: string;
  title: string;
  img: string;
}

export const categories: Category[] = [
  {
    slug: 'red',
    title: 'Красная рыба',
    img: '/categories/red-fish.jpg',
  },
  {
    slug: 'white',
    title: 'Белая рыба',
    img: '/categories/white-fish.jpg',
  },
  {
    slug: 'seafood',
    title: 'Морепродукты',
    img: '/categories/seafood.jpg',
  },
  {
    slug: 'caviar',
    title: 'Икра',
    img: '/categories/caviar.jpg',
  },
  {
    slug: 'ready',
    title: 'Готовые продукты',
    img: '/categories/ready.jpg',
  },
  {
    slug: 'new',
    title: 'Новинки',
    img: '/categories/new.jpg',
  },
];

export interface Product {
  /** Уникальный идентификатор товара */
  id: string;
  name: string;
  price: number;
  img: string;
  category: string;
  description: string;
  weight: string;
  /** Дополнительные изображения */
  images?: string[];
  /** Способ обработки */
  processing?: 'fresh' | 'frozen' | 'salted' | 'smoked';
  /** Вес упаковки, граммы */
  packageWeight?: number;
  /** Тип упаковки */
  packageType?: string;
  /** Регион происхождения */
  origin?: string;
  /** Сертификаты качества */
  certificates?: string[];
  /** Акционный товар */
  isPromo?: boolean;
  isNew?: boolean;
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Филе лосося охлажденное',
    price: 1299,
    img: '/products/red/salmon-fillet.jpg',
    images: ['/products/red/salmon-fillet.jpg', '/products/red/salmon-side.jpg'],
    category: 'red',
    description: 'Свежий атлантический лосось, охлажденное филе без кожи.',
    weight: '500 г',
    isNew: false,
  },
  {
    id: 'p2',
    name: 'Стейк кеты',
    price: 899,
    img: '/products/red/keta-steak.jpg',
    category: 'red',
    description: 'Стейк из кеты, приготовленный на гриле.',
    weight: '300 г',
    isNew: false,
  },
  {
    id: 'p3',
    name: 'Филе трески',
    price: 699,
    img: '/products/white/cod-fillet.jpg',
    category: 'white',
    description: 'Свежее филе трески, приготовленное на пару.',
    weight: '400 г',
    isNew: false,
  },
  {
    id: 'p4',
    name: 'Филе хека',
    price: 499,
    img: '/products/white/hake-fillet.jpg',
    category: 'white',
    description: 'Свежее филе хека, приготовленное на гриле.',
    weight: '350 г',
    isNew: false,
  },
  {
    id: 'p5',
    name: 'Креветки королевские',
    price: 1199,
    img: '/products/seafood/royal-shrimp.jpg',
    category: 'seafood',
    description: 'Креветки королевские, приготовленные на гриле.',
    weight: '200 г',
    isNew: false,
  },
  {
    id: 'p6',
    name: 'Коктейль из морепродуктов',
    price: 799,
    img: '/products/seafood/seafood-mix.jpg',
    category: 'seafood',
    description: 'Коктейль из морепродуктов, приготовленный на гриле.',
    weight: '300 г',
    isNew: false,
  },
  {
    id: 'p7',
    name: 'Икра кеты 140 г',
    price: 2599,
    img: '/products/caviar/keta-caviar.jpg',
    category: 'caviar',
    description: 'Икра кеты, приготовленная на гриле.',
    weight: '140 г',
    isNew: false,
  },
  {
    id: 'p8',
    name: 'Паштет из лосося',
    price: 299,
    img: '/products/ready/salmon-pate.jpg',
    category: 'ready',
    description: 'Паштет из лосося, приготовленный на гриле.',
    weight: '150 г',
    isNew: false,
  },
  {
    id: 'p9',
    name: 'Салат из морской капусты',
    price: 199,
    img: '/products/ready/seaweed-salad.jpg',
    category: 'ready',
    description: 'Салат из морской капусты, приготовленный на гриле.',
    weight: '200 г',
    isNew: false,
  },
  {
    id: 'p10',
    name: 'Филе палтуса копченое',
    price: 1399,
    img: '/products/new/halibut-smoked.jpg',
    category: 'new',
    description: 'Копченое на ольховой щепе филе палтуса холодного копчения.',
    weight: '300 г',
    isNew: true,
  },
  {
    id: 'p11',
    name: 'Стейк тунца охлажденный',
    price: 1499,
    img: '/products/new/tuna-steak.jpg',
    category: 'new',
    description: 'Свежий стейк из тунца, богатый омега-3.',
    weight: '350 г',
    isNew: true,
  },
  {
    id: 'p12',
    name: 'Крабовое мясо натуральное',
    price: 899,
    img: '/products/new/crab-meat.jpg',
    category: 'new',
    description: 'Нежное натуральное мясо краба без добавок.',
    weight: '250 г',
    isNew: true,
  },

];

/**
 * Интерфейс рецепта для раздела «Рецепты»
 */
export interface Recipe {
  /** Уникальный идентификатор */
  id: string;
  /**Slug для URL */
  slug: string;
  /** Название рецепта */
  title: string;
  /** Основное изображение */
  img: string;
  /** Краткое описание */
  shortDescription: string;
  /** Ингредиенты */
  ingredients: string[];
  /** Шаги приготовления */
  steps: string[];
  /** Категория блюда */
  category: string;
  /** Время приготовления, мин */
  cookingTime: number;
  /** Дополнительные изображения */
  images?: string[];
}

export const recipes: Recipe[] = [
  {
    id: 'r1',
    slug: 'salmon-steak-grill',
    title: 'Стейк из лосося на гриле',
    img: '/recipes/salmon-steak.jpg',
    shortDescription: 'Сочный стейк из свежего лосося с ароматом дыма.',
    ingredients: [
      'Филе лосося 500 г',
      'Оливковое масло 2 ст.л.',
      'Соль морская',
      'Перец свежемолотый',
      'Лимон',
    ],
    steps: [
      'Разогрейте гриль до средней температуры.',
      'Смажьте стейк оливковым маслом, посолите и поперчите.',
      'Готовьте по 4-5 минут с каждой стороны до румяной корочки.',
      'Подавайте с дольками лимона.',
    ],
    category: 'red',
    cookingTime: 15,
    images: ['/recipes/salmon-steak.jpg', '/recipes/salmon-steak-close.jpg'],
  },
  {
    id: 'r2',
    slug: 'shrimp-salad',
    title: 'Салат с королевскими креветками',
    img: '/recipes/shrimp-salad.jpg',
    shortDescription: 'Лёгкий салат из свежих овощей и сочных креветок.',
    ingredients: [
      'Креветки королевские 200 г',
      'Салат Ромен',
      'Черри 100 г',
      'Авокадо',
      'Оливковое масло',
      'Сок лимона',
    ],
    steps: [
      'Отварите креветки 2-3 минуты, очистите.',
      'Нарежьте овощи, смешайте с креветками.',
      'Заправьте маслом и лимонным соком, приправьте солью.',
    ],
    category: 'seafood',
    cookingTime: 10,
  },
  {
    id: 'r3',
    slug: 'cod-fillet-bake',
    title: 'Запечённое филе трески',
    img: '/recipes/cod-bake.jpg',
    shortDescription: 'Нежное филе трески, запечённое с травами.',
    ingredients: [
      'Филе трески 400 г',
      'Сливочное масло 30 г',
      'Чеснок 2 зубчика',
      'Смесь прованских трав',
      'Соль, перец',
    ],
    steps: [
      'Разогрейте духовку до 180 °C.',
      'Смешайте размягчённое масло с измельчённым чесноком и травами.',
      'Смажьте рыбу смесью, посолите и поперчите.',
      'Запекайте 15-20 минут до готовности.',
    ],
    category: 'white',
    cookingTime: 25,
  },
];

/**
 * Интерфейс новости / статьи
 */
export interface NewsArticle {
  /** Уникальный идентификатор */
  id: string;
  /** Slug для URL */
  slug: string;
  /** Заголовок */
  title: string;
  /** Изображение обложки */
  img: string;
  /** Краткий анонс */
  excerpt: string;
  /** HTML абзацы контента (упрощённо как строки) */
  content: string[];
  /** Дата публикации ISO */
  date: string;
  /** Категория (company, product, market, etc.) */
  category?: string;
}

export const news: NewsArticle[] = [
  {
    id: 'n1',
    slug: 'supply-chain-update-2025',
    title: 'Обновление цепочки поставок 2025',
    img: '/news/supply-chain.jpg',
    excerpt:
      'Компания «Бухта пеликанов» расширяет логистические мощности и открывает новый распределительный центр в Санкт-Петербурге.',
    content: [
      'Компания «Бухта пеликанов» официально объявила о запуске нового распределительного центра площадью 10 000 м², который позволит сократить сроки доставки продукции по Северо-Западному региону.',
      'Новый центр оборудован современными холодильными камерами и автоматизированными системами контроля качества.',
    ],
    date: '2025-05-12',
    category: 'company',
  },
  {
    id: 'n2',
    slug: 'new-product-line-healthy-snacks',
    title: 'Новая линейка полезных снеков',
    img: '/news/healthy-snacks.jpg',
    excerpt:
      'Мы запускаем серию низкокалорийных снеков из морепродуктов специально для офисных перекусов.',
    content: [
      'Линейка включает снеки из лосося, тунца и креветок, обогащённые омега-3 и белком.',
      'Продукты доступны в торговых сетях с июня 2025 года.',
    ],
    date: '2025-06-01',
    category: 'product',
  },
];
