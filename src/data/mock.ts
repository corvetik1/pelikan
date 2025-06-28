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
  id: string;
  name: string;
  price: number;
  img: string;
  category: string; // slug reference
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Филе лосося охлажденное',
    price: 1299,
    img: '/products/red/salmon-fillet.jpg',
    category: 'red',
  },
  {
    id: 'p2',
    name: 'Стейк кеты',
    price: 899,
    img: '/products/red/keta-steak.jpg',
    category: 'red',
  },
  {
    id: 'p3',
    name: 'Филе трески',
    price: 699,
    img: '/products/white/cod-fillet.jpg',
    category: 'white',
  },
  {
    id: 'p4',
    name: 'Филе хека',
    price: 499,
    img: '/products/white/hake-fillet.jpg',
    category: 'white',
  },
  {
    id: 'p5',
    name: 'Креветки королевские',
    price: 1199,
    img: '/products/seafood/royal-shrimp.jpg',
    category: 'seafood',
  },
  {
    id: 'p6',
    name: 'Коктейль из морепродуктов',
    price: 799,
    img: '/products/seafood/seafood-mix.jpg',
    category: 'seafood',
  },
  {
    id: 'p7',
    name: 'Икра кеты 140 г',
    price: 2599,
    img: '/products/caviar/keta-caviar.jpg',
    category: 'caviar',
  },
  {
    id: 'p8',
    name: 'Паштет из лосося',
    price: 299,
    img: '/products/ready/salmon-pate.jpg',
    category: 'ready',
  },
  {
    id: 'p9',
    name: 'Салат из морской капусты',
    price: 199,
    img: '/products/ready/seaweed-salad.jpg',
    category: 'ready',
  },
  {
    id: 'p10',
    name: 'Филе палтуса копченое',
    price: 1399,
    img: '/products/new/halibut-smoked.jpg',
    category: 'new',
  },
  {
    id: 'p11',
    name: 'Стейк тунца охлажденный',
    price: 1499,
    img: '/products/new/tuna-steak.jpg',
    category: 'new',
  },
  {
    id: 'p12',
    name: 'Крабовое мясо натуральное',
    price: 899,
    img: '/products/new/crab-meat.jpg',
    category: 'new',
  },
];
