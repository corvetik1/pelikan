import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Администратор сайта',
      permissions: ['*'],
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: 'viewer' },
    update: {},
    create: {
      name: 'viewer',
      description: 'Просмотр содержимого',
      permissions: [],
    },
  });

  // Users
  await prisma.user.upsert({
    where: { email: 'admin@pelicanbay.local' },
    update: {
      roles: {
        set: [{ id: adminRole.id }],
      },
    },
    create: {
      email: 'admin@pelicanbay.local',
      password: 'admin', // TODO: hash in production
      name: 'Admin',
      roles: {
        connect: { id: adminRole.id },
      },
    },
  });

  // Insert a demo product
  const product = await prisma.product.upsert({
    where: { slug: 'atlantic-salmon-steak' },
    update: {},
    create: {
      name: 'Atlantic Salmon Steak',
      slug: 'atlantic-salmon-steak',
      price: 1299,
      img: '/products/salmon-steak.jpg',
      description: 'Свежий стейк из атлантического лосося весом 300 г.',
      weight: '300 g',
      category: 'Fish',
      isNew: true,
      isPromo: false,
      certificates: [],
      images: ['/products/salmon-steak.jpg'],
    },
  });

  // Ensure category exists
  const corporateCategory = await prisma.newsCategory.upsert({
    where: { slug: 'corporate' },
    update: {},
    create: {
      slug: 'corporate',
      title: 'Corporate',
    },
  });

  // Sample news article
  await prisma.news.upsert({
    where: { id: 'news-sample-1' },
    update: {},
    create: {
      id: 'news-sample-1',
      title: 'Открыт новый распределительный центр',
      excerpt: '«Бухта пеликанов» расширяет логистику.',
      category: {
        connect: { id: corporateCategory.id },
      },
      date: new Date('2025-07-01'),
    },
  });

  // Sample store
  await prisma.store.upsert({
    where: { id: 'store-sample-1' },
    update: {},
    create: {
      id: 'store-sample-1',
      name: 'Fish Market Moscow',
      address: 'Москва, ул. Пример 1',
      lat: 55.7558,
      lng: 37.6176,
      region: 'Москва',
    },
  });

    // Sample recipe
  const recipe = await prisma.recipe.upsert({
    where: { slug: 'salmon-steak-grill' },
    update: {},
    create: {
      slug: 'salmon-steak-grill',
      title: 'Grilled Salmon Steak',
      img: '/recipes/salmon-steak.jpg',
      shortDescription: 'Сочный лосось на гриле за 15 минут',
      ingredients: ['Лосось', 'Соль', 'Перец', 'Оливковое масло'],
      steps: ['Замариновать', 'Гриль 7 минут с каждой стороны'],
      cookingTime: 15,
      category: 'Seafood',
      images: ['/recipes/salmon-steak.jpg'],
    },
  });

  // Relation recipe <-> product
  await prisma.recipeProduct.upsert({
    where: { recipeId_productId: { recipeId: recipe.id, productId: product.id } },
    update: {},
    create: { recipeId: recipe.id, productId: product.id },
  });

  // Default theme and settings
  const defaultTokens = JSON.parse(
    readFileSync(__dirname + '/../public/themes/default.json', 'utf-8'),
  );

  await prisma.theme.upsert({
    where: { slug: 'default' },
    update: { tokens: defaultTokens },
    create: {
      slug: 'default',
      name: 'Default',
      tokens: defaultTokens,
      preview: null,
    },
  });

  await prisma.settings.upsert({
    where: { id: 1 },
    update: { activeThemeSlug: 'default' },
    create: { activeThemeSlug: 'default' },
  });

  // Demo quote
  await prisma.quote.create({
    data: {
      items: [{ productId: product.id, qty: 10 }],
      prices: [{ productId: product.id, price: 1299 }],
      status: 'priced',
      userEmail: 'client@example.com',
    },
  });

  console.log('🌱 Database has been seeded.');
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
