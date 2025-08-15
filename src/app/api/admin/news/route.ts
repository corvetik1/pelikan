import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withInvalidate } from '@/lib/withInvalidate';
import { requireAdmin } from '@/lib/auth';
import { NewsCreateSchema } from '@/lib/validation/newsSchema';
import { handleError } from '@/lib/errorHandler';
import type { News } from '@prisma/client';
import { withLogger } from '@/lib/logger';
import { slugify } from '@/lib/slugify';

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

        // Generate base slug from title and ensure uniqueness
        const base = slugify(data.title);
        const seed = base.length > 0 ? base : `news-${Date.now().toString(36)}`;
        let unique = seed;
        for (let i = 0; ; i += 1) {
          const candidate = i === 0 ? unique : `${seed}-${i}`;
          const exists = await prisma.news.findUnique({ where: { slug: candidate } });
          if (!exists) {
            unique = candidate;
            break;
          }
        }

        const createData = {
          slug: unique,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          img: data.img && data.img.length > 0 ? data.img : undefined,
          categoryId: data.categoryId ?? undefined,
          date: data.date ? new Date(data.date) : undefined,
        } satisfies Parameters<typeof prisma.news.create>[0]['data'];

        const created: News = await prisma.news.create({ data: createData });
        return NextResponse.json(created, { status: 201 });
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);
