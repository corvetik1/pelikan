import type { Advantage, AdvantagePatch } from '@/types/advantages';

// Временное in-memory хранилище до миграции Prisma
const advantages: Advantage[] = [
  {
    id: 'adv-1',
    title: '15+ лет на рынке',
    subtitle: 'Опыт и доверие клиентов с 2009 года',
    icon: 'EmojiEvents',
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'adv-2',
    title: '500+ клиентов',
    subtitle: 'Партнёры в России и за рубежом',
    icon: 'People',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'adv-3',
    title: 'Сертификация MSC',
    subtitle: 'Международные стандарты устойчивого рыболовства',
    icon: 'Verified',
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'adv-4',
    title: 'Собственное производство',
    subtitle: 'Полный цикл — от вылова до упаковки',
    icon: 'Factory',
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getAdvantagesStore(): Advantage[] {
  return [...advantages].sort((a, b) => a.order - b.order);
}

export function updateAdvantageInStore(id: string, patch: AdvantagePatch): Advantage {
  const idx = advantages.findIndex((a) => a.id === id);
  if (idx === -1) {
    throw new Error('Advantage not found');
  }
  const prev = advantages[idx];
  const next: Advantage = {
    ...prev,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  advantages[idx] = next;
  return next;
}
