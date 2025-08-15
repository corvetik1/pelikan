import { NextResponse } from 'next/server';
import { withLogger } from '@/lib/logger';
import { requireAdmin } from '@/lib/auth';
import { handleError } from '@/lib/errorHandler';
import { withInvalidate } from '@/lib/withInvalidate';
import { advantagePatchSchema } from '@/lib/validation/advantagesSchema';
import { updateAdvantageInStore } from '@/server/stores/advantagesStore';

// Временная реализация на in-memory сторе. После миграции заменим на Prisma.
export const PATCH = withLogger(
  withInvalidate(
    [
      { type: 'Advantages', id: 'LIST' },
    ],
    'Преимущество обновлено',
  )(async (req: Request, { params }: { params: { id: string } }): Promise<Response> => {
    const auth = requireAdmin(req);
    if (auth) return auth;
    try {
      const json = await req.json();
      const patch = advantagePatchSchema.parse(json);
      const adv = updateAdvantageInStore(params.id, patch);
      return NextResponse.json(adv);
    } catch (err) {
      return handleError(err);
    }
  }),
);

export const runtime = 'nodejs';
