import { NextResponse } from 'next/server';
import { products as initial } from '@/data/mock';

// In-memory store (dev only)
const storeKey = '__mock_products__' as const;

type ProductStore = typeof initial;

const globalForProducts = globalThis as typeof globalThis & {
  [storeKey]: ProductStore;
};

if (!globalForProducts[storeKey]) {
  // deep clone to avoid mutating import
    globalForProducts[storeKey] = JSON.parse(JSON.stringify(initial)) as ProductStore;
}

const products: ProductStore = globalForProducts[storeKey];

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  const id = `p${Date.now()}`;
  const newProduct = { id, ...body };
  products.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}
