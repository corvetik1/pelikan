import { Grid } from '@mui/material';
import type { Product } from '@/data/mock';
import ProductCard from './ProductCard';

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <Grid container spacing={4} paddingY={4}>
      {products.map((p) => (
        <Grid item key={p.id} xs={12} sm={6} md={4}>
          <ProductCard product={p} />
        </Grid>
      ))}
    </Grid>
  );
}
