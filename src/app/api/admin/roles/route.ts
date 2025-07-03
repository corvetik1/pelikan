import prisma from "@/lib/prisma";
import type { AdminRole } from "@/types/admin";
import type { NextRequest } from "next/server";

export async function GET() {
  const roles = await prisma.role.findMany({ orderBy: { name: "asc" } });
  return Response.json(roles, { status: 200 });
}

export async function POST(req: NextRequest) {
  const data = (await req.json()) as Partial<AdminRole>;
  const role = await prisma.role.create({
    data: {
      name: data.name ?? "Новая роль",
      description: data.description ?? "",
      permissions: data.permissions ?? [],
    },
  });
  return Response.json(role, { status: 201 });
}
