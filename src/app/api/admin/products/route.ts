import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { ProductCreateSchema } from '@/lib/validation/productSchema';
import { handleError } from '@/lib/errorHandler';
import prisma from '@/lib/prisma';
import type { Prisma, Product } from '@prisma/client';

/**
 * GET /api/admin/products
 * Список товаров, отсортированный по времени создания (новые сверху)
 */
export async function GET(req?: Request) {
  const _req = req ?? new Request('http://localhost');
  const auth = requireAdmin(_req);
  if (auth) return auth;
  const list: Product[] = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(list);
}

/**
 * POST /api/admin/products
 * Создание нового товара. Ожидает JSON, соответствующий ProductUncheckedCreateInput.
 */
export async function POST(request: Request) {
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
}
