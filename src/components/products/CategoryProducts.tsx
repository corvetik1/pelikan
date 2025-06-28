'use client';

import { Box, CircularProgress } from '@mui/material';
import ProductsGrid from './ProductsGrid';
import { useGetProductsByCategoryQuery } from '@/redux/api';

interface CategoryProductsProps {
  slug: string;
}

export default function CategoryProducts({ slug }: CategoryProductsProps) {
  const { data, isLoading, isError } = useGetProductsByCategoryQuery(slug);

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

  return <ProductsGrid products={data} />;
}
