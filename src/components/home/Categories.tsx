'use client';

import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Link from 'next/link';

interface Category {
  title: string;
  img: string;
  href: string;
}

const categories: Category[] = [
  { title: 'Красная рыба', img: '/categories/red-fish.jpg', href: '/products/red' },
  { title: 'Белая рыба', img: '/categories/white-fish.jpg', href: '/products/white' },
  { title: 'Морепродукты', img: '/categories/seafood.jpg', href: '/products/seafood' },
  { title: 'Икра', img: '/categories/caviar.jpg', href: '/products/caviar' },
  { title: 'Готовые продукты', img: '/categories/ready.jpg', href: '/products/ready' },
  { title: 'Новинки', img: '/categories/new.jpg', href: '/products/new' },
];

export default function Categories() {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {categories.map(({ title, img, href }) => (
            <Grid key={title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ position: 'relative' }}>
                <CardActionArea LinkComponent={Link} href={href}>
                  <CardMedia component="img" height="220" image={img} alt={title} loading="lazy" />
                  <CardContent sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6" color="#fff">
                      {title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
