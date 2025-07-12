import { QuoteUpdatePricesSchema } from '@/lib/validation/quoteSchema';
import { requireAdmin } from '@/lib/auth';
import { handleError } from '@/lib/errorHandler';
import prisma from '@/lib/prisma';
import type { NextRequest } from 'next/server';

// PATCH /api/admin/quotes/[id]/prices – администратор заполняет цены и подтверждает расчёт
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // RBAC: simple token-based admin guard
  const authResp = requireAdmin(req);
  if (authResp) return authResp;
  try {
    const payload = await req.json();
    const data = QuoteUpdatePricesSchema.parse(payload);

    const { id } = await params;
    const updated = await prisma.quote.update({
      where: { id },
      data: {
        prices: data.prices,
        status: 'priced',
      },
    });

          // отправляем уведомления\n      try {\n        const { userEmail } = updated;\n        if (userEmail) {\n          const { sendQuoteReadyEmail } = await import('@/lib/mailer');\n          await sendQuoteReadyEmail(userEmail, updated.id);\n        }\n      } catch (e) {\n        /* eslint-disable no-console */\n        console.error('Email send failed', e);\n      }\n      // TODO: emit Socket.IO event to room <quoteId> once WS server implemented

    return Response.json(updated, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
