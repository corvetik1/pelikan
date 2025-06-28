import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import type { Product } from '@/data/mock';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea sx={{ height: '100%' }}>
        <CardMedia
          component="img"
          image={product.img}
          alt={product.name}
          sx={{ height: 180, objectFit: 'cover' }}
        />
        <CardContent>
          <Typography component="h3" variant="subtitle1" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.price.toLocaleString('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              maximumFractionDigits: 0,
            })}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
