import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withInvalidate } from '@/lib/withInvalidate';
import { requireAdmin } from '@/lib/auth';
import { StoreCreateSchema } from '@/lib/validation/storeSchema';
import { handleError } from '@/lib/errorHandler';
import type { Store } from '@prisma/client';
import { withLogger } from '@/lib/logger';

// GET /api/admin/stores – список магазинов
export const GET = withLogger(async (req: Request) => {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const list: Store[] = await prisma.store.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(list);
});

// POST /api/admin/stores – создать магазин
export const POST = withLogger(
  withInvalidate([{ type: 'AdminStore', id: 'LIST' }], 'Магазин создан')(
    async (request: Request) => {
      const auth = requireAdmin(request);
      if (auth) return auth;
      try {
        const payload = await request.json();
        const data = StoreCreateSchema.parse(payload);
        const created: Store = await prisma.store.create({ data });
        return NextResponse.json(created, { status: 201 });
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);
