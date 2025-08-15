import RecipeDetailPublic from '@/components/recipes/RecipeDetailPublic';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { siteOrigin } from '@/lib/site';
import type { AdminRecipe } from '@/types/admin';

export const revalidate = 300; // ISR 5 минут
export const runtime = 'nodejs';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const items = await prisma.recipe.findMany({ select: { slug: true }, take: 1000 });
  return items.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const recipe = await prisma.recipe.findUnique({ where: { slug } });
  const url = `/recipes/${slug}`;
  return {
    title: recipe ? `${recipe.title} | Рецепты` : 'Рецепт',
    description: recipe?.shortDescription ?? undefined,
    alternates: { canonical: url },
    openGraph: { type: 'article', title: recipe?.title, url, images: recipe?.img ? [{ url: recipe.img }] : undefined },
    twitter: { card: recipe?.img ? 'summary_large_image' : 'summary', title: recipe?.title, images: recipe?.img ? [recipe.img] : undefined },
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = params;
  const rec = await prisma.recipe.findUnique({ where: { slug } });
  if (!rec) notFound();

  const item: AdminRecipe = {
    id: rec.id,
    slug: rec.slug,
    title: rec.title,
    category: rec.category,
    cookingTime: rec.cookingTime,
    shortDescription: rec.shortDescription,
    img: rec.img ?? undefined,
    images: rec.images ?? undefined,
  };

  const origin = siteOrigin();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: item.title,
    description: item.shortDescription,
    totalTime: item.cookingTime ? `PT${item.cookingTime}M` : undefined,
    recipeCategory: item.category,
    url: `${origin}/recipes/${item.slug}`,
    image: item.img || undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RecipeDetailPublic recipe={item} />
    </>
  );
}
