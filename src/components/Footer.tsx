'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Компания
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/about">О нас</Link>
              <Link href="/about/history">История</Link>
              <Link href="/careers">Карьера</Link>
              <Link href="/contacts">Контакты</Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Продукция
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/products">Каталог</Link>
              <Link href="/products/new">Новинки</Link>
              <Link href="/certificates">Сертификаты</Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Покупателям
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/locations">Где купить</Link>
              <Link href="/recipes">Рецепты</Link>
              <Link href="/faq">FAQ</Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              B2B
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/b2b/retail">Для ритейла</Link>
              <Link href="/b2b/horeca">Для HoReCa</Link>
              <Link href="/b2b/prices">Прайс-листы</Link>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          © {year} Меридиан. Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
}
