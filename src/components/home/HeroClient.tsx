'use client';

import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import EditableField from '@/components/admin/EditableField';
import EditableParagraph from '@/components/admin/EditableParagraph';
import { useIsAdmin } from '@/context/AuthContext';
import { useUpdateHeroFieldMutation } from '@/redux/adminApi';
import { useGetHeroSlidesQuery, useGetSettingsQuery } from '@/redux/api';
import type { HeroSlide } from '@/types/hero';

const SlideBox = styled(Box)(() => ({
  position: 'relative',
  height: '80vh',
  minHeight: 500,
  display: 'flex',
  alignItems: 'center',
  color: '#fff',
}));

export default function HeroClient({ slides: initialSlides }: { slides: HeroSlide[] }): React.JSX.Element {
  const isAdmin = useIsAdmin();
  const [slides, setSlides] = React.useState<HeroSlide[]>(initialSlides);
  const [index, setIndex] = React.useState<number>(0);
  const [updateHeroField] = useUpdateHeroFieldMutation();
  const { data: settings } = useGetSettingsQuery();

  // Subscribe to realtime updates via RTK Query + Socket invalidate
  const { data: freshSlides } = useGetHeroSlidesQuery();
  React.useEffect(() => {
    if (freshSlides && freshSlides.length > 0) {
      setSlides(freshSlides);
      if (index >= freshSlides.length) setIndex(0);
    }
  }, [freshSlides, index]);

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const speed = typeof settings?.heroSpeedMs === 'number' && settings.heroSpeedMs > 0 ? settings.heroSpeedMs : 5000;
    const id = window.setInterval(() => setIndex((prev) => (prev + 1) % slides.length), speed);
    return () => window.clearInterval(id);
  }, [slides.length, settings?.heroSpeedMs]);

  if (slides.length === 0) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4">Нет слайдов</Typography>
      </Box>
    );
  }

  const slide = slides[index];

  return (
    <SlideBox>
      {slide.img && (
        <Image
          src={slide.img}
          alt={slide.title}
          fill
          priority={index === 0}
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
      )}
      <Box
        aria-hidden
        sx={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(12,74,110,0.65) 0%, rgba(3,105,161,0.6) 50%, rgba(2,132,199,0.6) 100%)' }}
      />
      <Container sx={{ position: 'relative', zIndex: 2 }} maxWidth="lg">
        {isAdmin ? (
          <EditableField
            value={slide.title}
            typographyProps={{ variant: 'h2', sx: { mb: 2 } }}
            onSave={async (v: string) => {
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
            onSave={async (v: string) => {
              setSlides((s) => s.map((sl) => (sl.id === slide.id ? { ...sl, subtitle: v } : sl)));
              await updateHeroField({ id: slide.id, patch: { subtitle: v } });
            }}
          />
        ) : (
          <Typography variant="h5" sx={{ mb: 4 }}>
            {slide.subtitle}
          </Typography>
        )}

        <Button href="/products" variant="contained" size="large" sx={{ mr: 2 }}>
          Каталог продукции
        </Button>
        <Button href="/contacts" variant="outlined" color="inherit" size="large">
          Связаться с нами
        </Button>
      </Container>
    </SlideBox>
  );
}
