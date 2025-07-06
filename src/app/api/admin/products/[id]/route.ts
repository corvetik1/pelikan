import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Prisma, Product } from '@prisma/client';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const patch = (await req.json()) as Prisma.ProductUncheckedUpdateInput;
  try {
    const updated: Product = await prisma.product.update({ where: { id }, data: patch });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const removed: Product = await prisma.product.delete({ where: { id } });
    return NextResponse.json(removed);
  } catch {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
}
