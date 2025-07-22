'use client';

// Hero component with inline editing for admins


import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import EditableField from '@/components/admin/EditableField';
import EditableParagraph from '@/components/admin/EditableParagraph';
import { useIsAdmin } from '@/context/AuthContext';
import { useUpdateHeroFieldMutation } from '@/redux/adminApi';
import { styled } from '@mui/material/styles';


interface Slide {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

// NOTE: initial slides static; will be updated in-place after save
const initialSlides: Slide[] = [
  {
    id: 'slide1',
    title: 'От океана к вашему столу',
    subtitle: 'Премиальные морепродукты напрямую от «Бухты пеликанов»',
    img: '/hero/slide1.jpg',
    primaryCta: { label: 'Смотреть каталог', href: '/products' },
    secondaryCta: { label: 'B2B предложение', href: '/b2b' },
  },
  {
    id: 'slide2',
    title: '15 лет экспертизы',
    subtitle: 'Современное производство полного цикла',
    img: '/hero/slide2.jpg',
    primaryCta: { label: 'О производстве', href: '/about/production' },
  },
  {
    id: 'slide3',
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
  const isAdmin = useIsAdmin();
  const [slides, setSlides] = React.useState<Slide[]>(initialSlides);
  const [updateHeroField] = useUpdateHeroFieldMutation();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(id);

  }, [slides.length]);

  const slide = slides[index];

  return (
    <SlideBox sx={{ backgroundImage: `url(${slide.img})` }}>
      <Container sx={{ position: 'relative', zIndex: 1 }} maxWidth="lg">
        {isAdmin ? (
          <EditableField
            value={slide.title}
            typographyProps={{ variant: 'h2', sx: { mb: 2 } }}
            onSave={async (v) => {
              setSlides((s) => s.map((sl) => (sl.id === slide.id ? { ...sl, title: v } : sl)));
              await updateHeroField({ id: slide.id, patch: { title: v } });
            }}
          />
        ) : (
          <Typography variant="h2" sx={{ mb: 2 }}>
            {slide.title}
          </Typography>
        )}
        {isAdmin ? (
          <EditableParagraph
            value={slide.subtitle}
            typographyProps={{ variant: 'h5', sx: { mb: 4 } }}
            onSave={async (v) => {
              setSlides((s) => s.map((sl) => (sl.id === slide.id ? { ...sl, subtitle: v } : sl)));
              await updateHeroField({ id: slide.id, patch: { subtitle: v } });
            }}
          />
        ) : (
          <Typography variant="h5" sx={{ mb: 4 }}>
            {slide.subtitle}
          </Typography>
        )}
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
