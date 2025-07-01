import type { NextRequest } from "next/server";
import { AdminStore } from "@/types/admin";
import { stores as seed } from "@/data/stores";

let adminStores: AdminStore[] = seed.map((s) => ({ ...s, isActive: true }));

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = (await req.json()) as Partial<AdminStore>;
  const idx = adminStores.findIndex((s) => s.id === params.id);
  if (idx === -1) return Response.json({ message: "Not found" }, { status: 404 });
  adminStores[idx] = { ...adminStores[idx], ...body };
  return Response.json(adminStores[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  adminStores = adminStores.filter((s) => s.id !== params.id);
  return Response.json({ ok: true });
}
