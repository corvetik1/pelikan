import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { broadcastInvalidate } from '@/server/socket';
import { requireAdmin } from '@/lib/auth';
import { StoreCreateSchema } from '@/lib/validation/storeSchema';
import { handleError } from '@/lib/errorHandler';
import type { Store } from '@prisma/client';
import { withLogger } from '@/lib/logger';

export const GET = withLogger(async (req: Request) => {
  const auth = requireAdmin(req);
  if (auth) return auth;
  const list: Store[] = await prisma.store.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(list);
});

export const POST = withLogger(async (request: Request) => {
  const auth = requireAdmin(request);
  if (auth) return auth;
  try {
    const payload = await request.json();
    const data = StoreCreateSchema.parse(payload);
    const created: Store = await prisma.store.create({ data });
    broadcastInvalidate([{ type: 'AdminStore', id: 'LIST' }], 'Магазин создан');
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
});
