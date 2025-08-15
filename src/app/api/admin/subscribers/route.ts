import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { withLogger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';
import { SubscriberListQuerySchema, SubscriberListResponseSchema } from '@/lib/validation/subscriberSchema';
import type { Prisma, $Enums } from '@prisma/client';

// GET /api/admin/subscribers — список с пагинацией/фильтрацией
export const GET = withLogger(async (req: Request): Promise<Response> => {
  const auth = requireAdmin(req);
  if (auth) return auth;
  try {
    const url = new URL(req.url);
    const parsed = SubscriberListQuerySchema.parse(Object.fromEntries(url.searchParams.entries()));

    const orderBy: Prisma.SubscriberOrderByWithRelationInput = parsed.sort
      ? (() => {
          const [field, order] = parsed.sort.split(',') as ['email' | 'status' | 'createdAt', 'asc' | 'desc'];
          return { [field]: order } as Prisma.SubscriberOrderByWithRelationInput;
        })()
      : ({ createdAt: 'desc' } as Prisma.SubscriberOrderByWithRelationInput);

    const where: Prisma.SubscriberWhereInput = parsed.status
      ? { status: parsed.status as $Enums.SubscriptionStatus }
      : {};

    const [itemsDb, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy,
        skip: (parsed.page - 1) * parsed.pageSize,
        take: parsed.pageSize,
      }),
      prisma.subscriber.count({ where }),
    ]);

    const items = itemsDb.map((s) => ({
      id: s.id,
      email: s.email,
      status: s.status,
      createdAt: s.createdAt.toISOString(),
    }));

    const payload = { items, total, page: parsed.page, pageSize: parsed.pageSize };
    // runtime assert for response shape
    SubscriberListResponseSchema.parse(payload);

    return NextResponse.json(payload);
  } catch (err) {
    return handleError(err);
  }
});
