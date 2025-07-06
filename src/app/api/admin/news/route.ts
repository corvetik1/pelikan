import prisma from '@/lib/prisma';
import type { NextRequest } from "next/server";



export async function GET() {
  const list = await prisma.news.findMany({ orderBy: { date: 'desc' } });
  return Response.json(list, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await prisma.news.create({ data: body });
  return Response.json(created, { status: 201 });
}
