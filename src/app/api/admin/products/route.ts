import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Prisma, Product } from '@prisma/client';

/**
 * GET /api/admin/products
 * Список товаров, отсортированный по времени создания (новые сверху)
 */
export async function GET() {
  const list: Product[] = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(list);
}

/**
 * POST /api/admin/products
 * Создание нового товара. Ожидает JSON, соответствующий ProductUncheckedCreateInput.
 */
export async function POST(request: Request) {
  const data = (await request.json()) as Prisma.ProductUncheckedCreateInput;
  // Гарантируем наличие slug (если клиент не передал)
  if (!data.slug && data.name) {
    data.slug = data.name.trim().toLowerCase().replace(/\s+/g, '-');
  }
  const created: Product = await prisma.product.create({ data });
  return NextResponse.json(created, { status: 201 });
}
