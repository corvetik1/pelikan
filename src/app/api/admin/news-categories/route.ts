import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { withLogger } from '@/lib/logger';
import { broadcastInvalidate } from '@/server/socket';
import { newsCategoryCreateSchema } from '@/lib/validation/newsCategorySchema';
import { slugify } from '@/lib/slugify';
import { handleError } from '@/lib/errorHandler';
import type { NewsCategory } from '@prisma/client';

/**
 * GET  /api/admin/news-categories
 * Public for admin panel – returns all categories sorted by title ASC
 */
export const GET = withLogger(async (req: Request) => {
  const auth = requireAdmin(req);
  if (auth) return auth;
  const list: NewsCategory[] = await prisma.newsCategory.findMany({ orderBy: { title: 'asc' } });
  return NextResponse.json(list);
});

/**
 * POST /api/admin/news-categories
 * Create new category. Body: { title: string }
 */
export const POST = withLogger(async (request: Request) => {
  const auth = requireAdmin(request);
  if (auth) return auth;
  try {
    const payload = await request.json();
    const data = newsCategoryCreateSchema.parse(payload);
    const created: NewsCategory = await prisma.newsCategory.create({
      data: {
        title: data.title,
        slug: slugify(data.title),
      },
    });
    broadcastInvalidate([{ type: 'NewsCategory', id: 'LIST' }], 'Категория создана');
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
});
