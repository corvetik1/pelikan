import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { NewsCreateSchema } from '@/lib/validation/newsSchema';
import { handleError } from '@/lib/errorHandler';
import type { News } from '@prisma/client';

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (auth) return auth;
  const list: News[] = await prisma.news.findMany({ orderBy: { date: 'desc' } });
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;
  try {
    const payload = await request.json();
    const data = NewsCreateSchema.parse(payload);
    const created: News = await prisma.news.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
