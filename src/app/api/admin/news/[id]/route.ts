import type { NextRequest } from "next/server";
import { news } from "@/data/mock";

let adminNews = [...news];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const idx = adminNews.findIndex((n) => n.id === params.id);
  if (idx === -1) return Response.json({ message: "Not found" }, { status: 404 });
  adminNews[idx] = { ...adminNews[idx], ...body };
  return Response.json(adminNews[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  adminNews = adminNews.filter((n) => n.id !== params.id);
  return Response.json({ ok: true });
}
