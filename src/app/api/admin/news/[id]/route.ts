import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.news.findUnique({ where: { id: params.id } });
  if (!item) return Response.json({ message: 'Not found' }, { status: 404 });
  return Response.json(item);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const patch = await req.json();
  try {
    const updated = await prisma.news.update({ where: { id: params.id }, data: patch });
    return Response.json(updated);
  } catch {
    return Response.json({ message: 'Not found' }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.news.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ message: 'Not found' }, { status: 404 });
  }
}
