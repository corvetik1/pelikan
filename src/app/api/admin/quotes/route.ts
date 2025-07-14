import prisma from '@/lib/prisma';
import { handleError } from '@/lib/errorHandler';
import { withLogger } from '@/lib/logger';

// GET /api/admin/quotes – список заявок для админки
export const GET = withLogger(async () => {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return Response.json(quotes, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
});
