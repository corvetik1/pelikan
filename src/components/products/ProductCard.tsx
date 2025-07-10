'use client';

import { Card, CardActionArea, CardMedia, CardContent, Typography, Chip, Box, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import ProductQuickView from './ProductQuickView';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea sx={{ height: '100%' }} onClick={handleOpen}>
        <Box position="relative">
          {product.isNew && (
            <Chip
              label="NEW"
              color="secondary"
              size="small"
              sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
            />
          )}
          <CardMedia
          component="img"
          image={product.img}
          alt={product.name}
          sx={{ height: 180, objectFit: 'cover' }}
        />
        </Box>
        <CardContent>
          <MuiLink component={Link} href={`/products/item/${product.id}`} underline="hover" color="inherit" sx={{ textDecoration: 'none' }}>
             <Typography component="h3" variant="subtitle1" gutterBottom>
               {product.name}
             </Typography>
           </MuiLink>
          <Typography variant="body2" color="text.secondary">
            {product.price.toLocaleString('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              maximumFractionDigits: 0,
            })}
          </Typography>
        </CardContent>
      </CardActionArea>
      <ProductQuickView product={product} open={open} onClose={handleClose} />
    </Card>
  );
}
