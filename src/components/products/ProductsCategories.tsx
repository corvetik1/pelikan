import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import Link from 'next/link';
import type { Category } from '@/data/mock';

interface ProductsCategoriesProps {
  categories: Category[];
}

export default function ProductsCategories({ categories }: ProductsCategoriesProps) {
  return (
    <Grid container spacing={4} paddingY={4}>
      {categories.map((cat) => (
        <Grid key={cat.slug} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardActionArea component={Link} href={`/products/${cat.slug}`} sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                image={cat.img}
                alt={cat.title}
                sx={{ height: 180, objectFit: 'cover' }}
              />
              <CardContent>
                <Typography component="h2" variant="h6" align="center">
                  {cat.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
