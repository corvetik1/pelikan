import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { withLogger } from '@/lib/logger';
import { broadcastInvalidate } from '@/server/socket';
import { newsCategoryUpdateSchema } from '@/lib/validation/newsCategorySchema';
import { slugify } from '@/lib/slugify';
import { handleError } from '@/lib/errorHandler';
import type { NewsCategory } from '@prisma/client';

export const PATCH = withLogger(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const auth = requireAdmin(req);
  if (auth) return auth;
  try {
    const { id } = await params;
    const payload = await req.json();
    const data = newsCategoryUpdateSchema.parse(payload);
    if (data.title) {
      Object.assign(data, { slug: slugify(data.title) });
    }
    const updated: NewsCategory = await prisma.newsCategory.update({ where: { id }, data });
    broadcastInvalidate([{ type: 'NewsCategory', id: 'LIST' }], 'Категория обновлена');
    return Response.json(updated);
  } catch (err) {
    return handleError(err);
  }
});

export const DELETE = withLogger(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const auth = requireAdmin(_req);
  if (auth) return auth;
  try {
    const { id } = await params;
    await prisma.newsCategory.delete({ where: { id } });
    broadcastInvalidate([{ type: 'NewsCategory', id: 'LIST' }], 'Категория удалена');
    return Response.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
});
