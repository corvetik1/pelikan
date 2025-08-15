import prisma from '@/lib/prisma';
import { handleError } from '@/lib/handleError';
import { withLogger } from '@/lib/logger';
import { withInvalidate } from '@/lib/withInvalidate';
import { userUpdateSchema } from '@/lib/validation/userSchema';

/**
 * Admin Users item API
 * PATCH  /api/admin/users/[id] – update user
 * DELETE /api/admin/users/[id] – delete user
 */

// PATCH /api/admin/users/[id] – обновить пользователя
export const PATCH = withLogger(
  withInvalidate([{ type: 'AdminUser', id: 'LIST' }], 'Пользователь обновлён')(
    async (req: Request, { params }: { params: { id: string } }) => {
      const { id } = params;
      try {
        const payload = await req.json();
        const parsed = userUpdateSchema.parse(payload);
        const { role, ...rest } = parsed;

        // Обновляем роль, если указана
        const roleUpdate = role
          ? await (async () => {
              const roleRecord = await prisma.role.findUnique({ where: { name: role } });
              if (!roleRecord) throw new Error(`Role ${role} not found`);
              return { roles: { set: [{ id: roleRecord.id }] } } as const;
            })()
          : {};

        const prismaUser = await prisma.user.update({
          where: { id },
          data: {
            ...rest,
            ...roleUpdate,
          },
          include: { roles: true },
        });

        const { roles: roleArr, ...userWithoutRoles } = prismaUser;
        const responseUser = {
          ...userWithoutRoles,
          role: roleArr?.[0]?.name ?? null,
        } as const;

        return Response.json(responseUser);
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);

// DELETE /api/admin/users/[id] – удалить пользователя
export const DELETE = withLogger(
  withInvalidate([{ type: 'AdminUser', id: 'LIST' }], 'Пользователь удалён')(
    async (_req: Request, { params }: { params: { id: string } }) => {
      const { id } = params;
      try {
        await prisma.user.delete({ where: { id } });
        return Response.json({ ok: true });
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);
