import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withLogger } from '@/lib/logger';
import { requireAdmin } from '@/lib/auth';
import { handleError } from '@/lib/errorHandler';
import { heroCreateSchema } from '@/lib/validation/heroSchema';

/**
 * POST /api/admin/hero
 * Создаёт новый hero-слайд. Максимум 3 слайда в системе.
 * Доступ: только админ.
 */
export const POST = withLogger(async (req: Request): Promise<Response> => {
  const auth = requireAdmin(req);
  if (auth) return auth;

  try {
    const json = await req.json();
    const input = heroCreateSchema.parse(json);

    // Enforce max 3 slides
    const count = await prisma.hero.count();
    if (count >= 3) {
      return NextResponse.json({ error: 'Лимит слайдов достигнут (макс. 3)' }, { status: 400 });
    }

    const created = await prisma.hero.create({
      data: {
        title: input.title,
        subtitle: input.subtitle ?? '',
        img: input.img,
      },
    });

    const slide = {
      id: created.id,
      title: created.title,
      subtitle: created.subtitle,
      img: created.img,
      createdAt: created.createdAt?.toISOString?.(),
      updatedAt: created.updatedAt?.toISOString?.(),
    };

    const { broadcastInvalidate } = await import('@/server/socket');
    broadcastInvalidate([
      { type: 'Hero', id: created.id },
      { type: 'Hero', id: 'LIST' },
    ], 'Hero создан');

    return NextResponse.json(slide, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
});

export const runtime = 'nodejs';
