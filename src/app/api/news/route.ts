import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withLogger } from '@/lib/logger';

// Prisma не поддерживается в Edge runtime → используем Node.js
export const runtime = 'nodejs';

/**
 * Public GET /api/news
 * Возвращает список новостей в порядке убывания даты.
 */
export const GET = withLogger(async () => {
  const list = await prisma.news.findMany({
    orderBy: { date: 'desc' },
  });
  return NextResponse.json(list);
});
