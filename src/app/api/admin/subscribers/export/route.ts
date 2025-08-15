import { requireAdmin } from '@/lib/auth';
import { handleError } from '@/lib/errorHandler';
import prisma from '@/lib/prisma';
import { SubscriptionStatusEnum } from '@/lib/validation/subscriberSchema';

// GET /api/admin/subscribers/export — вернуть CSV, опционально с фильтром по статусу
export const GET = async (req: Request): Promise<Response> => {
  const auth = requireAdmin(req);
  if (auth) return auth;
  try {
    const url = new URL(req.url);
    const statusRaw = url.searchParams.get('status');
    const status = statusRaw ? SubscriptionStatusEnum.parse(statusRaw) : undefined;

    const where = status ? { status } : {};
    const rows = await prisma.subscriber.findMany({ where, orderBy: { createdAt: 'desc' } });

    const header = 'email,status,createdAt';
    const lines = rows.map((r) => `${r.email},${r.status},${r.createdAt.toISOString()}`);
    const body = [header, ...lines].join('\n');

    return new Response(body, {
      status: 200,
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': 'attachment; filename="subscribers.csv"',
        // Prevent caching in admin export
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    return handleError(err);
  }
};
