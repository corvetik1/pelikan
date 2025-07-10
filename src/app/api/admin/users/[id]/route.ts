import prisma from "@/lib/prisma";
import { z } from "zod";
import { handleError } from "@/lib/errorHandler";
import type { Prisma } from "@prisma/client";

/**
 * Admin Users item API
 * PATCH /api/admin/users/[id] – update user
 * DELETE /api/admin/users/[id] – delete user
 */

const UserPatchSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().min(1).max(64).optional(),
  role: z.enum(["admin", "editor", "viewer"]).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
  try {
    const payload = await req.json();
    const data = UserPatchSchema.parse(payload) as Prisma.UserUncheckedUpdateInput;

    const updated = await prisma.user.update({ where: { id }, data });
    return Response.json(updated);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.user.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
