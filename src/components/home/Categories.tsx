import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CategoriesClient from '@/components/home/CategoriesClient';
import { getCategories } from '@/lib/data/categories';
import type { Category } from '@/types/category';

export default async function Categories(): Promise<React.JSX.Element> {
  const items: Category[] = await getCategories();
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <CategoriesClient categories={items} />
      </Container>
    </Box>
  );
}
