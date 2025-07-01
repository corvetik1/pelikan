import { news } from "@/data/mock";
import type { NextRequest } from "next/server";

// In-memory storage for admin news (clone of mock.news)
const adminNews = [...news];

export async function GET() {
  return Response.json(adminNews, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = `news-${Date.now()}`;
  const item = { ...body, id };
  adminNews.push(item);
  return Response.json(item, { status: 201 });
}
