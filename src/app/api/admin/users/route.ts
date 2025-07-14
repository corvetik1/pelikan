import prisma from "@/lib/prisma";
import { z } from "zod";
import { handleError } from "@/lib/handleError";
import { withLogger } from '@/lib/logger';

/**
 * Admin Users API
 * GET  /api/admin/users   – list users
 * POST /api/admin/users   – create user
 */

export const GET = withLogger(async () => {
  const list = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
      return Response.json(list);
});

const UserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(64).optional(),
  role: z.enum(["admin", "viewer", "editor"]).optional(),
  isActive: z.boolean().optional(),
});

export const POST = withLogger(async (request: Request) => {
  try {
    const payload = await request.json();
    const data = UserCreateSchema.parse(payload);

    // map role string to Role connection if provided
    let roleConnect = {};
    if (data.role) {
      const role = await prisma.role.findUnique({ where: { name: data.role } });
      if (!role) throw new Error(`Role ${data.role} not found`);
      roleConnect = { roles: { connect: { id: role.id } } };
    }

    const created = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        isActive: data.isActive ?? true,
        ...roleConnect,
      },
      include: {
        roles: true,
      },
    });
    return Response.json(created, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
});
