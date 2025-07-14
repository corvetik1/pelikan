import prisma from "@/lib/prisma";
import { handleError } from "@/lib/handleError";
import { roleUpdateSchema } from "@/lib/validation/roleSchema";
import { withLogger } from '@/lib/logger';


export const PATCH = withLogger(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
        const { id } = await params;
    const payload = await req.json();
        const data = roleUpdateSchema.parse(payload);
    const role = await prisma.role.update({
            where: { id },
            data,
    });
        return Response.json(role);
  } catch (err) {
    return handleError(err);
  }
});

export const DELETE = withLogger(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
        await prisma.role.delete({ where: { id } });
        return Response.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
});
