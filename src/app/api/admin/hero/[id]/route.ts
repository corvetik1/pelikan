import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

/**
 * PATCH /api/admin/hero/:id
 * Обновляет отдельные поля hero-слайда (title, subtitle, img).
 * Доступ: только админ (проверяется в middleware).
 */

const patchSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    subtitle: z.string().min(1).max(500).optional(),
    img: z.string().url().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Patch object must not be empty',
  });

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const json = (await req.json()) as unknown;
  const patch = patchSchema.parse(json);

  await prisma.hero.update({
    where: { id },
    data: patch,
  });

  return NextResponse.json({ ok: true });
}

export const runtime = 'nodejs';
