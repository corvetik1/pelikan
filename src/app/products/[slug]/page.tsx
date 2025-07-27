import CategoryProducts from '@/components/products/CategoryProducts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const revalidate = 300; // 5 minutes ISR

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const rows = await prisma.product.groupBy({ by: ['category'] });
    return rows.map((r) => ({ slug: r.category }));
  } catch {
    // Database unavailable during CI – generate no static params
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const title = slug.charAt(0).toUpperCase() + slug.slice(1);
    return { title: `${title} | Продукция` } as Metadata;
  } catch {
    return { title: 'Продукция' } as Metadata;
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const exists = await prisma.product.findFirst({ where: { category: slug }, select: { id: true } });
  if (!exists) notFound();
  return <CategoryProducts slug={slug} />;
}
