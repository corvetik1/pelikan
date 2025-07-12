import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { RecipeUpdateSchema } from '@/lib/validation/recipeSchema';
import { handleError } from '@/lib/errorHandler';
import prisma from '@/lib/prisma';
import type { Recipe } from '@prisma/client';









export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if (auth) return auth;
  const { id } = await params;
  try {
    const payload = await req.json();
    const data = RecipeUpdateSchema.parse(payload);
    const { productIds, ...recipePatch } = data;
    const updated: Recipe = await prisma.recipe.update({ where: { id }, data: recipePatch });
    if (productIds) {
      await prisma.recipeProduct.deleteMany({ where: { recipeId: id } });
      if (productIds.length) {
        await prisma.recipeProduct.createMany({ data: productIds.map((pid) => ({ recipeId: id, productId: pid })) });
      }
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(_req);
  if (auth) return auth;
  const { id } = await params;
  try {
    const removed: Recipe = await prisma.recipe.delete({ where: { id } });
    return NextResponse.json(removed);
  } catch (err) {
    return handleError(err);
  }
}
