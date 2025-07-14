import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withLogger } from '@/lib/logger';

// Prisma не поддерживается в Edge runtime → используем Node.js
export const runtime = 'nodejs';

/**
 * Public GET /api/products
 * Optional query param `category` for filtering.
 */
export const GET = withLogger(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const list = await prisma.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: 'desc' },
  });
    return NextResponse.json(list);
});
