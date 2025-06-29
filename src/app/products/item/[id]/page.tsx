import ProductDetail from '@/components/products/ProductDetail';
import { products } from '@/data/mock';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 300; // ISR 5 минут

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  return {
    title: product ? `${product.name} | Продукция` : 'Товар',
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
