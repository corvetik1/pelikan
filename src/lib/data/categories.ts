import prisma from '@/lib/prisma';
import type { Category } from '@/types/category';

/**
 * Получить список категорий каталога из товаров.
 * Используется на главной странице и на странице каталога.
 * Возвращает слаг, человеко-понятный заголовок и репрезентативное изображение.
 */
export async function getCategories(): Promise<Category[]> {
  type CategoryGroup = { category: string; _min: { img: string | null } };
  try {
    const rows = await prisma.product.groupBy({
      by: ['category'],
      _min: { img: true },
    });
    return (rows as CategoryGroup[]).map((r: CategoryGroup) => ({
      slug: r.category,
      title: r.category ? r.category.charAt(0).toUpperCase() + r.category.slice(1) : 'Категория',
      img: r._min.img ?? '/placeholder.jpg',
    }));
  } catch {
    // В окружениях без БД (CI) — вернуть пустой список
    return [];
  }
}
