import { NextRequest } from 'next/server';
import { products } from '@/data/mock';

export const runtime = 'edge';

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const filtered = category ? products.filter((p) => p.category === category) : products;
  return Response.json(filtered);
}
