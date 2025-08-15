import type { HeroSlide } from '@/types/hero';

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-slide-1',
    title: 'От океана к вашему столу',
    subtitle: 'Премиальные морепродукты напрямую от «Бухты пеликанов»',
    img: '/hero/slide1.jpg',
  },
  {
    id: 'hero-slide-2',
    title: '15 лет экспертизы',
    subtitle: 'Современное производство полного цикла',
    img: '/hero/slide2.jpg',
  },
  {
    id: 'hero-slide-3',
    title: 'Экологически чистые продукты',
    subtitle: 'Сертификация MSC и международные стандарты качества',
    img: '/hero/slide3.jpg',
  },
];

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    // Dynamic import prevents Prisma client from initialising at module-eval time in Jest
    const { default: prisma } = await import('@/lib/prisma');
    const list = await prisma.hero.findMany({ orderBy: { createdAt: 'asc' }, take: 3 });
    // Map prisma Date fields to string for serialization if needed upstream
    const mapped: HeroSlide[] = list.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      img: s.img,
      createdAt: s.createdAt?.toISOString?.() ?? undefined,
      updatedAt: s.updatedAt?.toISOString?.() ?? undefined,
    }));
    if (mapped.length > 0) return mapped;
  } catch (_err) {
    // In test or when DB is not available, fall back to defaults
  }
  return DEFAULT_HERO_SLIDES;
}
