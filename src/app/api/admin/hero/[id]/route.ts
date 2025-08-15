import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withLogger } from '@/lib/logger';
import { requireAdmin } from '@/lib/auth';
import { handleError } from '@/lib/errorHandler';
import { heroPatchSchema } from '@/lib/validation/heroSchema';

/**
 * PATCH /api/admin/hero/:id
 * Обновляет отдельные поля hero-слайда (title, subtitle, img).
 * Доступ: только админ (проверяется в middleware).
 */

export const PATCH = withLogger(async (req: Request, { params }: { params: { id: string } }) => {
  const auth = requireAdmin(req);
  if (auth) return auth;

  try {
    const { id } = params;
    const json = await req.json();
    const patch = heroPatchSchema.parse(json);

    await prisma.hero.update({ where: { id }, data: patch });

    // Realtime invalidation for Hero
    const { broadcastInvalidate } = await import('@/server/socket');
    broadcastInvalidate(
      [
        { type: 'Hero', id },
        { type: 'Hero', id: 'LIST' },
      ],
      'Hero обновлён',
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
});

/**
 * DELETE /api/admin/hero/:id
 * Удаляет hero-слайд по id. Доступ: только админ.
 */
export const DELETE = withLogger(async (req: Request, { params }: { params: { id: string } }) => {
  const auth = requireAdmin(req);
  if (auth) return auth;

  try {
    const { id } = params;
    await prisma.hero.delete({ where: { id } });

    const { broadcastInvalidate } = await import('@/server/socket');
    broadcastInvalidate(
      [
        { type: 'Hero', id },
        { type: 'Hero', id: 'LIST' },
      ],
      'Hero удалён',
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
});

export const runtime = 'nodejs';
