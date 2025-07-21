import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { RecipeUpdateSchema } from '@/lib/validation/recipeSchema';
import { handleError } from '@/lib/errorHandler';
import prisma from '@/lib/prisma';
import { withLogger } from '@/lib/logger';
import { broadcastInvalidate } from '@/server/socket';
import type { Recipe } from '@prisma/client';









export const PATCH = withLogger(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const auth = requireAdmin(req);
  if (auth) return auth;
  const { id } = await params;
  try {
    const payload = await req.json();
    const data = RecipeUpdateSchema.parse(payload);
    const { productIds, ...recipePatch } = data;
    const updated: Recipe = await prisma.recipe.update({ where: { id }, data: recipePatch });
    broadcastInvalidate([{ type: 'AdminRecipe', id: 'LIST' }], 'Рецепт обновлён');
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
});

export const DELETE = withLogger(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const auth = requireAdmin(_req);
  if (auth) return auth;
  const { id } = await params;
  try {
    const removed: Recipe = await prisma.recipe.delete({ where: { id } });
    broadcastInvalidate([{ type: 'AdminRecipe', id: 'LIST' }], 'Рецепт удалён');
    return NextResponse.json(removed);
  } catch (err) {
    return handleError(err);
  }
});
