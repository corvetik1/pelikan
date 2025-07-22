import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withLogger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';
import { ReviewCreateSchema } from '@/lib/validation/reviewSchema';

export const runtime = 'nodejs';

const PAGE_SIZE = 10;

/**
 * GET /api/products/:id/reviews
 * Returns approved reviews for a product, paginated.
 * Query params: page (number, default 1)
 */
export const GET = withLogger(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') ?? '1');
  const sort = searchParams.get('sort') ?? 'new'; // 'new' | 'old' | 'rating'
  const skip = (page - 1) * PAGE_SIZE;
  const orderBy =
    sort === 'rating'
      ? { rating: 'desc' as const }
      : { createdAt: sort === 'old' ? ('asc' as const) : ('desc' as const) };

  const reviews = await prisma.review.findMany({
    where: { productId: id, status: 'approved' },
    orderBy,
    skip,
    take: PAGE_SIZE,
  });

    const total = await prisma.review.count({ where: { productId: id, status: 'approved' } });
  return NextResponse.json({ items: reviews, total });
});

/**
 * POST /api/products/:id/reviews
 * Creates a new review (status pending).
 */
export const POST = withLogger(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const json = await request.json();
    // Ensure route param productId matches body
    const { id } = await params;
    json.productId = id;
    const data = ReviewCreateSchema.parse(json);

    const created = await prisma.review.create({
      data: {
        productId: data.productId,
        rating: data.rating,
        body: data.body,
        author: data.author,
        status: 'pending',
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
});
