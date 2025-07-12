import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { NewsUpdateSchema } from '@/lib/validation/newsSchema';
import { handleError } from '@/lib/errorHandler';
import type { News } from '@prisma/client';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if (auth) return auth;
  const { id } = await params;
  const item = await prisma.news.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(request);
  if (auth) return auth;
  try {
    const { id } = await params;
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
