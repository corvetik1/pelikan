import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { StoreUpdateSchema } from '@/lib/validation/storeSchema';
import { handleError } from '@/lib/errorHandler';
import type { Store } from '@prisma/client';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = requireAdmin(request);
  if (auth) return auth;
  try {
    const payload = await request.json();
    const data = StoreUpdateSchema.parse(payload);
    const updated: Store = await prisma.store.update({ where: { id: params.id }, data });
    return NextResponse.json(updated);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const auth = requireAdmin(request);
  if (auth) return auth;
  try {
    await prisma.store.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
