import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withLogger } from '@/lib/logger';
import { requireAdmin } from '@/lib/auth';
import { handleError } from '@/lib/errorHandler';
import { ReviewUpdateStatusSchema } from '@/lib/validation/reviewSchema';

export const runtime = 'nodejs';

/**
 * PATCH /api/admin/reviews/:id
 * Body: { status: 'approved' | 'rejected' }
 */
export const PATCH = withLogger(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const { id } = await params;
    const json = await request.json();
    const { status } = ReviewUpdateStatusSchema.parse(json);

    const updated = await prisma.review.update({
      where: { id },
      data: { status },
      include: { product: { select: { name: true } } },
    });

    // Broadcast invalidate for realtime updates
    const { broadcastInvalidate } = await import('@/server/socket');
    broadcastInvalidate([{ type: 'AdminReview', id }, { type: 'AdminReview', id: 'LIST' }], 'Отзыв обновлён');

    return NextResponse.json({
      ...updated,
      productName: updated.product?.name ?? '',
    });
  } catch (err) {
    return handleError(err);
  }
});
