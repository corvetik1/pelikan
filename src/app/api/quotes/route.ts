import { QuoteCreateSchema } from '@/lib/validation/quoteSchema';
import prisma from '@/lib/prisma';
import { handleError } from '@/lib/errorHandler';

import { withLogger } from '@/lib/logger';

// POST /api/quotes – создаёт запрос КП (без цен)
export const POST = withLogger(async (req: Request) => {
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
});
