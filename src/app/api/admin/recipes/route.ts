import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { RecipeCreateSchema } from '@/lib/validation/recipeSchema';
import { handleError } from '@/lib/errorHandler';
import type { Recipe } from '@prisma/client';
import { withLogger } from '@/lib/logger';

/**
 * CRUD for recipes (GET list, POST create)
 */


export const GET = withLogger(async (req: Request) => {
  const auth = requireAdmin(req);
  if (auth) return auth;
  const list: Recipe[] = await prisma.recipe.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(list);
});

export const POST = withLogger(async (request: Request) => {
  const auth = requireAdmin(request);
  if (auth) return auth;
  try {
    const payload = await request.json();
    const data = RecipeCreateSchema.parse(payload);
    const { productIds = [], ...recipeData } = data;
    // Prisma model requires slug & required columns
    const slug = recipeData.slug ?? recipeData.title.trim().toLowerCase().replace(/\s+/g, '-');
    const img = recipeData.img ?? '';
    const images = recipeData.images ?? [];
    const created = await prisma.recipe.create({
      data: {
        ...recipeData,
        slug,
        img,
        images,
      },
    });
    if (productIds.length) {
      await prisma.recipeProduct.createMany({
        data: productIds.map((pid) => ({ recipeId: created.id, productId: pid })),
      });
    }
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
});
