import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import type { AdminRole } from "@/types/admin";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const patch = (await req.json()) as Partial<AdminRole>;
  try {
    const { id, ...data } = patch;
    void id;
    const role = await prisma.role.update({
      where: { id: params.id },
      data: data,
    });
    return Response.json(role);
  } catch {
    return Response.json({ message: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.role.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ message: "Not found" }, { status: 404 });
  }
}
