import { handleError } from '@/lib/errorHandler';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

// GET /api/quotes/:id – клиент получает расчёт (может быть без цен)
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const quote = await prisma.quote.findUniqueOrThrow({ where: { id: params.id } });
    return Response.json(quote, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
