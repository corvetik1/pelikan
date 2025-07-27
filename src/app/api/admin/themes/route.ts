import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { withLogger } from '@/lib/logger';
import { withInvalidate } from '@/lib/withInvalidate';
import { themeCreateSchema } from '@/lib/validation/themeSchema';
import { slugify } from '@/lib/slugify';
import { handleError } from '@/lib/errorHandler';
import type { Theme } from '@prisma/client';

/**
 * GET /api/admin/themes – список тем
 */
export const GET = withLogger(async (req: Request) => {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const list: Theme[] = await prisma.theme.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(list);
});

/**
 * POST /api/admin/themes – создать новую тему
 */
export const POST = withLogger(
  withInvalidate([{ type: 'Theme', id: 'LIST' }], 'Тема создана')(
    async (request: Request) => {
      const auth = requireAdmin(request);
      if (auth) return auth;
      try {
        const payload = await request.json();
        const data = themeCreateSchema.parse(payload);
        const slug = data.slug ?? slugify(data.name);

        const created: Theme = await prisma.theme.create({
          data: {
            name: data.name,
            slug,
            tokens: data.tokens,
            preview: data.preview ?? null,
          },
        });

        return NextResponse.json(created, { status: 201 });
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);
