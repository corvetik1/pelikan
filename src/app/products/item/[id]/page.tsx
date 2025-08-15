import ProductDetail from '@/components/products/ProductDetail';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import type { Product } from '@/types/product';

export const runtime = 'nodejs';
export const revalidate = 300; // ISR 5 минут

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  const list = await prisma.product.findMany({ select: { id: true } });
  return list.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const product = await prisma.product.findUnique({ where: { id }, select: { name: true } });
  return {
    title: product ? `${product.name} | Продукция` : 'Товар',
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = params;
  const dbProduct = await prisma.product.findUnique({ where: { id } });
  if (!dbProduct) notFound();
  const product: Product = {
    ...dbProduct,
    createdAt: dbProduct.createdAt?.toISOString() ?? undefined,
    slug: dbProduct.slug ?? dbProduct.id,
  } as Product;
  return <ProductDetail product={product} />;
}
