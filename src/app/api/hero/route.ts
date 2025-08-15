import { NextResponse } from 'next/server';
import { withLogger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';
import { getHeroSlides } from '@/lib/data/hero';
import { heroSlideListSchema } from '@/lib/validation/heroSchema';

export const GET = withLogger(async (): Promise<Response> => {
  try {
    const slides = await getHeroSlides();
    const data = heroSlideListSchema.parse(slides);
    return NextResponse.json(data);
  } catch (err) {
    return handleError(err);
  }
});

export const runtime = 'nodejs';
