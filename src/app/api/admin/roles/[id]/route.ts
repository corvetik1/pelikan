import prisma from "@/lib/prisma";
import { handleError } from "@/lib/handleError";
import { roleUpdateSchema } from "@/lib/validation/roleSchema";
import { withLogger } from '@/lib/logger';
import { broadcastInvalidate } from '@/server/socket';


export const PATCH = withLogger(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
        const { id } = await params;
    const payload = await req.json();
        const data = roleUpdateSchema.parse(payload);
    const role = await prisma.role.update({
            where: { id },
            data,
    });
        broadcastInvalidate([{ type: 'AdminRole', id: 'LIST' }], 'Роль обновлена');
    return Response.json(role);
  } catch (err) {
    return handleError(err);
  }
});

export const DELETE = withLogger(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
        await prisma.role.delete({ where: { id } });
        broadcastInvalidate([{ type: 'AdminRole', id: 'LIST' }], 'Роль удалена');
        return Response.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
});
