import prisma from "@/lib/prisma";
import { roleCreateSchema } from "@/lib/validation/roleSchema";
import { handleError } from "@/lib/handleError";
import { withLogger } from '@/lib/logger';
import { broadcastInvalidate } from '@/server/socket';



export const GET = withLogger(async (_req: Request) => {
  void _req.method;
  const roles = await prisma.role.findMany({ orderBy: { name: "asc" } });
    return Response.json(roles, { status: 200 });
});

export const POST = withLogger(async (req: Request) => {
  try {
    const payload = await req.json();
    const data = roleCreateSchema.parse(payload);

  const role = await prisma.role.create({
    data: {
      name: data.name ?? "Новая роль",
      description: data.description ?? "",
      permissions: data.permissions ?? [],
    },
  });
    broadcastInvalidate([{ type: 'AdminRole', id: 'LIST' }], 'Роль создана');
    return Response.json(role, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
});
