import { requireAdmin } from '@/lib/auth';
import { handleError } from '@/lib/errorHandler';
import { withLogger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { broadcastInvalidate } from '@/server/socket';
import { z } from 'zod';

// PATCH /api/admin/quotes/[id] – обновление статуса заявки (approve/reject)
export const PATCH = withLogger(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const authResp = requireAdmin(req);
  if (authResp) return authResp;
  try {
    const { id } = await params;
    const payload = await req.json();

    // Схема валидации для статуса заявки
    const data = z
      .object({
        status: z.enum(['pending', 'priced', 'rejected']),
      })
      .strict()
      .parse(payload);

    const updated = await prisma.quote.update({
      where: { id },
      data: { status: data.status },
    });

    broadcastInvalidate(
      [
        { type: 'AdminQuote', id },
        { type: 'AdminQuote', id: 'LIST' },
      ],
      'Заявка обновлена',
    );

    return Response.json(updated, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
});

// DELETE /api/admin/quotes/[id] – удаление заявки
export const DELETE = withLogger(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const authResp = requireAdmin(_req);
  if (authResp) return authResp;
  try {
    const { id } = await params;
    const removed = await prisma.quote.delete({ where: { id } });

    broadcastInvalidate(
      [
        { type: 'AdminQuote', id },
        { type: 'AdminQuote', id: 'LIST' },
      ],
      'Заявка удалена',
    );

    return Response.json(removed, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
});
