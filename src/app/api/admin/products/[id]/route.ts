import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { ProductUpdateSchema } from '@/lib/validation/productSchema';
import { handleError } from '@/lib/errorHandler';
import prisma from '@/lib/prisma';
import type { Prisma, Product } from '@prisma/client';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if (auth) return auth;
  const { id } = params;
  try {
    const payload = await req.json();
    const patchData = ProductUpdateSchema.parse(payload) as Prisma.ProductUncheckedUpdateInput;
    // auto-generate slug if name changed and slug not provided
    if (!patchData.slug && typeof patchData.name === 'string') {
      patchData.slug = patchData.name.trim().toLowerCase().replace(/\s+/g, '-');
    }
    const updated: Product = await prisma.product.update({ where: { id }, data: patchData });
    return NextResponse.json(updated);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = requireAdmin(_req);
  if (auth) return auth;
  const { id } = params;
  try {
    const removed: Product = await prisma.product.delete({ where: { id } });
    return NextResponse.json(removed);
  } catch (err) {
    return handleError(err);
  }
}
