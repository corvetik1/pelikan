import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { broadcastInvalidate } from '@/server/socket';
import { requireAdmin } from '@/lib/auth';
import { NewsCreateSchema } from '@/lib/validation/newsSchema';
import { handleError } from '@/lib/errorHandler';
import type { News } from '@prisma/client';

import { withLogger } from '@/lib/logger';

export const GET = withLogger(async (req: Request) => {
  const auth = requireAdmin(req);
  if (auth) return auth;
  const list: News[] = await prisma.news.findMany({ orderBy: { date: 'desc' } });
  return NextResponse.json(list);
});

export const POST = withLogger(async (request: Request) => {
  const auth = requireAdmin(request);
  if (auth) return auth;
  try {
    const payload = await request.json();
    const data = NewsCreateSchema.parse(payload);
    const created: News = await prisma.news.create({ data });
    broadcastInvalidate([{ type: 'AdminNews', id: 'LIST' }], 'Новость создана');
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
});
