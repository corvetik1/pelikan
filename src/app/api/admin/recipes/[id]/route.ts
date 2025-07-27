import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { RecipeUpdateSchema } from '@/lib/validation/recipeSchema';
import { handleError } from '@/lib/errorHandler';
import prisma from '@/lib/prisma';
import { withLogger } from '@/lib/logger';
import { withInvalidate } from '@/lib/withInvalidate';
import type { Recipe } from '@prisma/client';

// PATCH /api/admin/recipes/[id] – обновить рецепт
export const PATCH = withLogger(
  withInvalidate([{ type: 'AdminRecipe', id: 'LIST' }], 'Рецепт обновлён')(
    async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
      const auth = requireAdmin(req);
      if (auth) return auth;

      const { id } = await params;
      try {
        const payload = await req.json();
        const data = RecipeUpdateSchema.parse(payload);
        const { productIds, ...recipePatch } = data;

        const updated: Recipe = await prisma.recipe.update({ where: { id }, data: recipePatch });

        // Обновляем связи many-to-many с продуктами
        if (productIds) {
          await prisma.recipeProduct.deleteMany({ where: { recipeId: id } });
          if (productIds.length) {
            await prisma.recipeProduct.createMany({
              data: productIds.map((pid) => ({ recipeId: id, productId: pid })),
            });
          }
        }

        return NextResponse.json(updated);
      } catch {
        return NextResponse.json({ message: 'Not found' }, { status: 404 });
      }
    },
  ),
);

// DELETE /api/admin/recipes/[id] – удалить рецепт
export const DELETE = withLogger(
  withInvalidate([{ type: 'AdminRecipe', id: 'LIST' }], 'Рецепт удалён')(
    async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
      const auth = requireAdmin(req);
      if (auth) return auth;

      const { id } = await params;
      try {
        const removed: Recipe = await prisma.recipe.delete({ where: { id } });
        return NextResponse.json(removed);
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);
