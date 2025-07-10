import ProductsCategories from '@/components/products/ProductsCategories';
import CatalogFiltersPanel from '@/components/catalog/CatalogFiltersPanel';
import prisma from '@/lib/prisma';
import type { Category } from '@/types/category';

// Revalidate every hour
export const runtime = 'nodejs';
export const revalidate = 3600;

export default async function ProductsPage() {
  // Получаем уникальные категории из товаров
  type CategoryGroup = { category: string; _min: { img: string | null } };
  const rows = await prisma.product.groupBy({
    by: ['category'],
    _min: {
      img: true,
    },
  });
  const categories: Category[] = (rows as CategoryGroup[]).map((r: CategoryGroup) => ({
    slug: r.category,
    title: r.category.charAt(0).toUpperCase() + r.category.slice(1),
    img: r._min.img ?? '/placeholder.jpg',
  }));
  return (
    <>
      <CatalogFiltersPanel />
      <ProductsCategories categories={categories} />
    </>
  );
}
