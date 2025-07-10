import { PrismaClient } from '@prisma/client';

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
    update: {},
    create: {
      email: 'admin@pelicanbay.local',
      password: 'admin', // TODO: hash in production
      name: 'Admin',
      role: adminRole.name,
    },
  });

  // Insert a demo product
  await prisma.product.upsert({
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

  // Sample news article
  await prisma.news.upsert({
    where: { id: 'news-sample-1' },
    update: {},
    create: {
      id: 'news-sample-1',
      title: 'Открыт новый распределительный центр',
      excerpt: '«Бухта пеликанов» расширяет логистику.',
      category: 'corporate',
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
