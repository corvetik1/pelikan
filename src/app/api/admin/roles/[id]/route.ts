import prisma from '@/lib/prisma';
import { handleError } from '@/lib/handleError';
import { roleUpdateSchema } from '@/lib/validation/roleSchema';
import { withLogger } from '@/lib/logger';
import { withInvalidate } from '@/lib/withInvalidate';
import { requireAdmin } from '@/lib/auth';
import type { Role } from '@prisma/client';

// PATCH /api/admin/roles/[id] – обновить роль
export const PATCH = withLogger(
  withInvalidate([{ type: 'AdminRole', id: 'LIST' }], 'Роль обновлена')(
    async (req: Request, { params }: { params: { id: string } }) => {
      const auth = requireAdmin(req);
      if (auth) return auth;
      try {
        const { id } = params;
        const payload = await req.json();
        const data = roleUpdateSchema.parse(payload);
        const role: Role = await prisma.role.update({ where: { id }, data });
        return Response.json(role);
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);

// DELETE /api/admin/roles/[id] – удалить роль
export const DELETE = withLogger(
  withInvalidate([{ type: 'AdminRole', id: 'LIST' }], 'Роль удалена')(
    async (req: Request, { params }: { params: { id: string } }) => {
      const auth = requireAdmin(req);
      if (auth) return auth;
      try {
        const { id } = params;
        await prisma.role.delete({ where: { id } });
        return Response.json({ ok: true });
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);
