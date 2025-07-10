import { QuoteCreateSchema } from '@/lib/validation/quoteSchema';
import prisma from '@/lib/prisma';
import { handleError } from '@/lib/errorHandler';
import type { NextRequest } from 'next/server';

// POST /api/quotes – создаёт запрос КП (без цен)
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const data = QuoteCreateSchema.parse(payload);

    const quote = await prisma.quote.create({
      data: {
        items: data.items,
        userEmail: data.userEmail,
        status: 'pending',
      },
      select: {
        id: true,
      },
    });

    return Response.json(quote, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
