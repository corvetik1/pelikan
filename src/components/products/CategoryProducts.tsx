'use client';

'use client';

import { Box, CircularProgress } from '@mui/material';
import { useState, useMemo } from 'react';
import CatalogFiltersPanel from '@/components/catalog/CatalogFiltersPanel';
import ProductsFilters, { ProductsFilterState, SortOption } from './ProductsFilters';
import ProductsGrid from './ProductsGrid';
import { useGetProductsByCategoryQuery } from '@/redux/api';

interface CategoryProductsProps {
  slug: string;
}

export default function CategoryProducts({ slug }: CategoryProductsProps) {
  const { data, isLoading, isError } = useGetProductsByCategoryQuery(slug);

  const [filters, setFilters] = useState<ProductsFilterState>({ sort: 'default', onlyNew: false });

  const filteredProducts = useMemo(() => {
    if (!data) return [];
    let list = [...data];

    // новинки фильтр
    if (filters.onlyNew) {
      list = list.filter((p) => p.isNew);
    }

    // сортировка
    switch (filters.sort as SortOption) {
      case 'priceAsc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newFirst':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        break;
    }

    return list;
  }, [data, filters]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" padding={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box padding={4} textAlign="center">
        Ошибка загрузки товаров.
      </Box>
    );
  }

  return (
    <>
      <CatalogFiltersPanel />
      <ProductsFilters value={filters} onChange={setFilters} />
      <ProductsGrid products={filteredProducts} />
    </>
  );
}
