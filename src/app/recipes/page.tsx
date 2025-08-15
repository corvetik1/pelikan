import RecipesList from '@/components/recipes/RecipesList';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';
import { siteOrigin } from '@/lib/site';
import type { AdminRecipe } from '@/types/admin';

export const runtime = 'nodejs';
export const revalidate = 300; // ISR 5 минут

export const metadata: Metadata = {
  title: 'Рецепты',
  alternates: { canonical: '/recipes' },
  openGraph: { type: 'website', title: 'Рецепты', url: '/recipes' },
  twitter: { card: 'summary', title: 'Рецепты' },
};

export default async function RecipesPage(): Promise<React.JSX.Element> {
  const recs = await prisma.recipe.findMany({ orderBy: { createdAt: 'desc' } });
  const items: AdminRecipe[] = recs.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    cookingTime: r.cookingTime,
    shortDescription: r.shortDescription,
    img: r.img ?? undefined,
    images: r.images ?? undefined,
  }));

  const origin = siteOrigin();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.slice(0, 10).map((n, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Recipe',
        name: n.title,
        totalTime: n.cookingTime ? `PT${n.cookingTime}M` : undefined,
        description: n.shortDescription,
        url: `${origin}/recipes/${n.slug}`,
        image: n.img || undefined,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RecipesList recipes={items} />
    </>
  );
}
