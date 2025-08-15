import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withLogger } from '@/lib/logger';

export const runtime = 'nodejs';

/**
 * Public GET /api/recipes
 * Возвращает список рецептов (последние сверху).
 */
export const GET = withLogger(async () => {
  const list = await prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(list);
});
