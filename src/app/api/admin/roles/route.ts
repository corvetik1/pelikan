import prisma from "@/lib/prisma";
import { z } from "zod";
import { handleError } from "@/lib/errorHandler";

import type { NextRequest } from "next/server";

export async function GET() {
  const roles = await prisma.role.findMany({ orderBy: { name: "asc" } });
  return Response.json(roles, { status: 200 });
}

const RoleSchema = z.object({
  name: z.string().min(1).max(64),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const data = RoleSchema.parse(payload);

  const role = await prisma.role.create({
    data: {
      name: data.name ?? "Новая роль",
      description: data.description ?? "",
      permissions: data.permissions ?? [],
    },
  });
    return Response.json(role, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
