import { NextResponse } from 'next/server';
import { withLogger } from '@/lib/logger';
import { withInvalidate } from '@/lib/withInvalidate';
import { requireAdmin } from '@/lib/auth';
import { ProductCreateSchema } from '@/lib/validation/productSchema';
import { handleError } from '@/lib/errorHandler';
import prisma from '@/lib/prisma';
import type { Prisma, Product } from '@prisma/client';

/**
 * GET /api/admin/products
 * Список товаров, отсортированный по времени создания (новые сверху)
 */
export const GET = withLogger(async (request: Request) => {
  const auth = requireAdmin(request);
  if (auth) return auth;
    const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  const list: Product[] = await prisma.product.findMany({
    where: q
      ? {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
    take: q ? 20 : undefined,
  });
  return NextResponse.json(list);
});

/**
 * POST /api/admin/products
 * Создание нового товара. Ожидает JSON, соответствующий ProductUncheckedCreateInput.
 */
export const POST = withLogger(
  withInvalidate([{ type: 'AdminProduct', id: 'LIST' }], 'Товар создан')(
    async (request: Request) => {
  const auth = requireAdmin(request);
  if (auth) return auth;
  try {
    const payload = await request.json();
    const data = ProductCreateSchema.parse(payload) as Prisma.ProductUncheckedCreateInput;
    // Гарантируем наличие slug (если клиент не передал)
    if (!data.slug && data.name) {
      data.slug = data.name.trim().toLowerCase().replace(/\s+/g, '-');
    }
    const created: Product = await prisma.product.create({ data });
        return NextResponse.json(created, { status: 201 });
    } catch (err) {
    return handleError(err);
   }
  }));
