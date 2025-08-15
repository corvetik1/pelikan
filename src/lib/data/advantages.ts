import type { Advantage } from '@/types/advantages';
import { getAdvantagesStore } from '@/server/stores/advantagesStore';

export async function getAdvantages(): Promise<Advantage[]> {
  // На данном этапе используем временное in-memory хранилище.
  // Позже будет заменено на Prisma.
  const list = getAdvantagesStore();
  return list.map((a) => ({
    id: a.id,
    title: a.title,
    subtitle: a.subtitle,
    icon: a.icon,
    order: a.order,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }));
}
