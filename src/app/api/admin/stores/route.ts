import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { StoreCreateSchema } from '@/lib/validation/storeSchema';
import { handleError } from '@/lib/errorHandler';
import type { Store } from '@prisma/client';

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (auth) return auth;
  const list: Store[] = await prisma.store.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(list);
}

export async function POST(request: Request) {
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
}
