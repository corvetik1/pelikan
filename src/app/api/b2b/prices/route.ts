import prisma from '@/lib/prisma';
import { withLogger } from '@/lib/logger';

// GET /api/b2b/prices – returns current B2B price list from DB
export const GET = withLogger(async () => {
  const rows = await prisma.product.findMany({ select: { id: true, price: true } });
    return Response.json(rows, { status: 200 });
});
