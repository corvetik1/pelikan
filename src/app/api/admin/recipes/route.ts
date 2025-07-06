import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Prisma, Recipe } from '@prisma/client';

/**
 * CRUD for recipes (GET list, POST create)
 */


export async function GET() {
  const list: Recipe[] = await prisma.recipe.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const data = (await request.json()) as Prisma.RecipeUncheckedCreateInput;
  if (!data.slug && data.title) {
    data.slug = data.title.trim().toLowerCase().replace(/\s+/g, '-');
  }
  const created: Recipe = await prisma.recipe.create({ data });
  return NextResponse.json(created, { status: 201 });
}
