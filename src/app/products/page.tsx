import ProductsCategories from '@/components/products/ProductsCategories';
import { categories } from '@/data/mock';

// Revalidate every hour
export const revalidate = 3600;

export default function ProductsPage() {
  return <ProductsCategories categories={categories} />;
}
