'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

interface Slide {
  title: string;
  subtitle: string;
  img: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

const slides: Slide[] = [
  {
    title: 'От океана к вашему столу',
    subtitle: 'Премиальные морепродукты напрямую от «Бухты пеликанов»',
    img: '/hero/slide1.jpg',
    primaryCta: { label: 'Смотреть каталог', href: '/products' },
    secondaryCta: { label: 'B2B предложение', href: '/b2b' },
  },
  {
    title: '15 лет экспертизы',
    subtitle: 'Современное производство полного цикла',
    img: '/hero/slide2.jpg',
    primaryCta: { label: 'О производстве', href: '/about/production' },
  },
  {
    title: 'Экологически чистые продукты',
    subtitle: 'Сертификация MSC и международные стандарты качества',
    img: '/hero/slide3.jpg',
    primaryCta: { label: 'Наши сертификаты', href: '/certificates' },
  },
];

const SlideBox = styled(Box)(() => ({
  position: 'relative',
  height: '80vh',
  minHeight: 500,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  color: '#fff',

  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
  },
}));

export default function Hero() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];

  return (
    <SlideBox sx={{ backgroundImage: `url(${slide.img})` }}>
      <Container sx={{ position: 'relative', zIndex: 1 }} maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 2 }}>
          {slide.title}
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          {slide.subtitle}
        </Typography>
        <Button href={slide.primaryCta.href} variant="contained" size="large" sx={{ mr: 2 }}>
          {slide.primaryCta.label}
        </Button>
        {slide.secondaryCta && (
          <Button href={slide.secondaryCta.href} variant="outlined" size="large" color="secondary">
            {slide.secondaryCta.label}
          </Button>
        )}
      </Container>
    </SlideBox>
  );
}
