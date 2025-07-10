import prisma from "@/lib/prisma";
import { z } from "zod";
import { handleError } from "@/lib/errorHandler";
import type { Prisma } from "@prisma/client";

/**
 * Admin Users API
 * GET  /api/admin/users   – list users
 * POST /api/admin/users   – create user
 */

export async function GET() {
  const list = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json(list);
}

const UserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(64).optional(),
  role: z.enum(["admin", "editor", "viewer"]).optional(),
  isActive: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = UserCreateSchema.parse(payload) as Prisma.UserUncheckedCreateInput;

    const created = await prisma.user.create({ data });
    return Response.json(created, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
