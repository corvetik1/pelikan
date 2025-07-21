import prisma from "@/lib/prisma";
import { handleError } from "@/lib/handleError";
import { withLogger } from '@/lib/logger';
import { broadcastInvalidate } from '@/server/socket';
import { userUpdateSchema } from "@/lib/validation/userSchema";

/**
 * Admin Users item API
 * PATCH /api/admin/users/[id] – update user
 * DELETE /api/admin/users/[id] – delete user
 */

export const PATCH = withLogger(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
  try {
    const payload = await req.json();
    const parsed = userUpdateSchema.parse(payload);

    const { role, ...rest } = parsed;

    let roleUpdate = {};
    if (role) {
      const roleRecord = await prisma.role.findUnique({ where: { name: role } });
      if (!roleRecord) throw new Error(`Role ${role} not found`);
      roleUpdate = { roles: { set: [{ id: roleRecord.id }] } };
    }

    const prismaUser = await prisma.user.update({
      where: { id },
      data: {
        ...rest,
        ...roleUpdate,
      },
      include: { roles: true },
    });

    const { roles: roleArray, ...userWithoutRoles } = prismaUser;
    const responseUser = {
      ...userWithoutRoles,
      role: roleArray?.[0]?.name ?? null,
    };
    broadcastInvalidate([{ type: 'AdminUser', id: 'LIST' }], 'Пользователь обновлён');
    return Response.json(responseUser);
  } catch (err) {
    return handleError(err);
  }
});

export const DELETE = withLogger(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  try {
    await prisma.user.delete({ where: { id } });
    broadcastInvalidate([{ type: 'AdminUser', id: 'LIST' }], 'Пользователь удалён');
    return Response.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
});
