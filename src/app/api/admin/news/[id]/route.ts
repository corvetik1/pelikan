import { NextResponse } from 'next/server';
import { withLogger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { withInvalidate } from '@/lib/withInvalidate';
import { requireAdmin } from '@/lib/auth';
import { NewsUpdateSchema } from '@/lib/validation/newsSchema';
import { handleError } from '@/lib/errorHandler';
import type { News } from '@prisma/client';

// GET /api/admin/news/[id] – получить одну новость
export const GET = withLogger(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const { id } = await params;
  const item = await prisma.news.findUnique({ where: { id }, include: { category: true } });
  if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
});

// PATCH /api/admin/news/[id] – обновить новость
export const PATCH = withLogger(
  withInvalidate([{ type: 'AdminNews', id: 'LIST' }], 'Новость обновлена')(
    async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
      const auth = requireAdmin(request);
      if (auth) return auth;
      try {
        const payload = await request.json();
        const data = NewsUpdateSchema.parse(payload);
        const { id } = await params;
        const updated: News = await prisma.news.update({ where: { id }, data });
        return NextResponse.json(updated);
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);

// DELETE /api/admin/news/[id] – удалить новость
export const DELETE = withLogger(
  withInvalidate([{ type: 'AdminNews', id: 'LIST' }], 'Новость удалена')(
    async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
      const auth = requireAdmin(request);
      if (auth) return auth;
      try {
        const { id } = await params;
        await prisma.news.delete({ where: { id } });
        return NextResponse.json({ ok: true });
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);
