import { NextResponse } from 'next/server';
import { withInvalidate } from '@/lib/withInvalidate';
import { requireAdmin } from '@/lib/auth';
import { handleError } from '@/lib/errorHandler';
import prisma from '@/lib/prisma';
import type { $Enums } from '@prisma/client';
import { SubscriberPatchSchema } from '@/lib/validation/subscriberSchema';

// PATCH /api/admin/subscribers/[id] — изменить статус подписчика
export const PATCH = withInvalidate([{ type: 'Subscriber', id: 'LIST' }], 'Список подписчиков обновлён')(
  async function patchSubscriber(req: Request, { params }: { params: { id: string } }): Promise<Response> {
    const auth = requireAdmin(req);
    if (auth) return auth;
    const { id } = params;
    try {
      const payload = await req.json();
      const data = SubscriberPatchSchema.parse(payload);
      const updated = await prisma.subscriber.update({ where: { id }, data: { status: data.status as $Enums.SubscriptionStatus } });
      return NextResponse.json({
        id: updated.id,
        email: updated.email,
        status: updated.status,
        createdAt: updated.createdAt.toISOString(),
      });
    } catch (err) {
      return handleError(err);
    }
  },
);

// DELETE /api/admin/subscribers/[id] — удалить подписчика
export const DELETE = withInvalidate([{ type: 'Subscriber', id: 'LIST' }], 'Список подписчиков обновлён')(
  async function deleteSubscriber(req: Request, { params }: { params: { id: string } }): Promise<Response> {
    const auth = requireAdmin(req);
    if (auth) return auth;
    const { id } = params;
    try {
      await prisma.subscriber.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    } catch (err) {
      return handleError(err);
    }
  },
);
