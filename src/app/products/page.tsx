import ProductsCategories from '@/components/products/ProductsCategories';
import CatalogFiltersPanel from '@/components/catalog/CatalogFiltersPanel';
import { categories } from '@/data/mock';

// Revalidate every hour
export const revalidate = 3600;

export default function ProductsPage() {
  return (
    <>
      <CatalogFiltersPanel />
        <ProductsCategories categories={categories} />
    </>
  );
}
