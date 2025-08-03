import { QuoteUpdatePricesSchema } from '@/lib/validation/quoteSchema';
import { requireAdmin } from '@/lib/auth';
import { handleError } from '@/lib/errorHandler';
import prisma from '@/lib/prisma';
import { broadcastInvalidate } from '@/server/socket';
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

// отправляем уведомление на email и invalidate cache
    try {
      const { userEmail } = updated;
      if (userEmail) {
        const { sendQuoteReadyEmail } = await import('@/lib/mailer');
        await sendQuoteReadyEmail(userEmail, updated.id);
      }
    } catch (e) {
      console.error('Email send failed', e);
    }

    broadcastInvalidate([{ type: 'AdminQuote', id }, { type: 'AdminQuote', id: 'LIST' }], 'Заявка обновлена');

    return Response.json(updated, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
