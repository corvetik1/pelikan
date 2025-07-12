import prisma from "@/lib/prisma";
import { roleCreateSchema } from "@/lib/validation/roleSchema";
import { handleError } from "@/lib/handleError";

import type { NextRequest } from "next/server";

export async function GET() {
  const roles = await prisma.role.findMany({ orderBy: { name: "asc" } });
  return Response.json(roles, { status: 200 });
}

export async function POST(req: NextRequest) {
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
    return Response.json(role, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
