import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withLogger } from '@/lib/logger';
import { requireAdmin } from '@/lib/auth';

// Use Node runtime for Prisma
export const runtime = 'nodejs';

const PAGE_SIZE = 20;

/**
 * GET /api/admin/reviews
 * Optional query params:
 *  - status: pending | approved | rejected
 *  - productId: UUID of product
 *  - page: number (default 1)
 */
export const GET = withLogger(async (request: Request) => {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | null;
  const productId = searchParams.get('productId');
  const page = Number(searchParams.get('page') ?? '1');
  const skip = (page - 1) * PAGE_SIZE;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (productId) where.productId = productId;

  const list = await prisma.review.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip,
    take: PAGE_SIZE,
    include: {
      product: {
        select: { name: true },
      },
    },
  });

  // Map to include productName for frontend convenience
  const mapped = list.map((r: typeof list[number]) => ({
    ...r,
    productName: r.product?.name ?? '',
  }));

  const total = await prisma.review.count({ where });

  return NextResponse.json({ items: mapped, total });
});
