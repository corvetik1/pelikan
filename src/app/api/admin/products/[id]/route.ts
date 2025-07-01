import { NextResponse } from 'next/server';
import { products as initial } from '@/data/mock';

const storeKey = '__mock_products__' as const;

type ProductStore = typeof initial;

const globalForProducts = globalThis as typeof globalThis & {
  [storeKey]: ProductStore;
};

if (!globalForProducts[storeKey]) {
  globalForProducts[storeKey] = JSON.parse(JSON.stringify(initial)) as ProductStore;
}

const products: ProductStore = globalForProducts[storeKey];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const patch = await req.json();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  products[idx] = { ...products[idx], ...patch };
  return NextResponse.json(products[idx]);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  const removed = products.splice(idx, 1)[0];
  return NextResponse.json(removed);
}
