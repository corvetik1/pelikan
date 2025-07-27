import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withInvalidate } from '@/lib/withInvalidate';
import { requireAdmin } from '@/lib/auth';
import { NewsCreateSchema } from '@/lib/validation/newsSchema';
import { handleError } from '@/lib/errorHandler';
import type { News } from '@prisma/client';
import { withLogger } from '@/lib/logger';

// GET /api/admin/news – список новостей
export const GET = withLogger(async (req: Request) => {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const list = await prisma.news.findMany({
    orderBy: { date: 'desc' },
    include: { category: true },
  });
  return NextResponse.json(list);
});

// POST /api/admin/news – создать новость
export const POST = withLogger(
  withInvalidate([{ type: 'AdminNews', id: 'LIST' }], 'Новость создана')(
    async (request: Request) => {
      const auth = requireAdmin(request);
      if (auth) return auth;
      try {
        const payload = await request.json();
        const data = NewsCreateSchema.parse(payload);
        const created: News = await prisma.news.create({ data });
        return NextResponse.json(created, { status: 201 });
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);
