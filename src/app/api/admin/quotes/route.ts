import prisma from '@/lib/prisma';
import { handleError } from '@/lib/errorHandler';

// GET /api/admin/quotes – список заявок для админки
export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return Response.json(quotes, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
