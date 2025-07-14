import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { StoreUpdateSchema } from '@/lib/validation/storeSchema';
import { handleError } from '@/lib/errorHandler';
import type { Store } from '@prisma/client';
import { withLogger } from '@/lib/logger';

export const PATCH = withLogger(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const auth = requireAdmin(request);
  if (auth) return auth;
  try {
    const payload = await request.json();
    const data = StoreUpdateSchema.parse(payload);
    const { id } = await params;
    const updated: Store = await prisma.store.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err) {
    return handleError(err);
  }
});

export const DELETE = withLogger(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const auth = requireAdmin(request);
  if (auth) return auth;
  try {
    const { id } = await params;
    await prisma.store.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
});
