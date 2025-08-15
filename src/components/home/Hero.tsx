import React from 'react';
import { getHeroSlides } from '@/lib/data/hero';
import type { HeroSlide } from '@/types/hero';
import HeroClient from '@/components/home/HeroClient';

export default async function Hero(): Promise<React.JSX.Element> {
  const slides: HeroSlide[] = await getHeroSlides();
  return <HeroClient slides={slides} />;
}
