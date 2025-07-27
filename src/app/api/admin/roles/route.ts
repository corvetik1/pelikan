import prisma from '@/lib/prisma';
import { roleCreateSchema } from '@/lib/validation/roleSchema';
import { handleError } from '@/lib/handleError';
import { withLogger } from '@/lib/logger';
import { withInvalidate } from '@/lib/withInvalidate';
import type { Role } from '@prisma/client';

// GET /api/admin/roles – список ролей
export const GET = withLogger(async (_req: Request) => {
  void _req.method; // для удовлетворения eslint/no-unused-vars
  const roles: Role[] = await prisma.role.findMany({ orderBy: { name: 'asc' } });
  return Response.json(roles, { status: 200 });
});

// POST /api/admin/roles – создать роль
export const POST = withLogger(
  withInvalidate([{ type: 'AdminRole', id: 'LIST' }], 'Роль создана')(
    async (req: Request) => {
      try {
        const payload = await req.json();
        const data = roleCreateSchema.parse(payload);

        const role: Role = await prisma.role.create({
          data: {
            name: data.name ?? 'Новая роль',
            description: data.description ?? '',
            permissions: data.permissions ?? [],
          },
        });

        return Response.json(role, { status: 201 });
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);
