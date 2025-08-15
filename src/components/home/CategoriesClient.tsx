'use client';

import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import type { Category } from '@/types/category';

interface CategoriesClientProps {
  categories: Category[];
}

export default function CategoriesClient({ categories }: CategoriesClientProps): React.JSX.Element {
  return (
    <Grid container spacing={4}>
      {categories.map(({ slug, title, img }) => (
        <Grid key={slug} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ position: 'relative' }}>
            <CardActionArea LinkComponent={Link} href={`/products/${slug}`}>
              <CardMedia component="img" height="220" image={img} alt={title} loading="lazy" />
              <CardContent
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" color="#fff">
                  {title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
