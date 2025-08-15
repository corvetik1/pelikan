import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

function baseUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? '';
  return env || 'http://localhost:3000';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = baseUrl();

  const [news, recipes] = await Promise.all([
    prisma.news.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.recipe.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${origin}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${origin}/news`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${origin}/recipes`, changeFrequency: 'daily', priority: 0.8 },
  ];

  const newsPages: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${origin}/news/${n.slug}`,
    lastModified: n.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const recipePages: MetadataRoute.Sitemap = recipes.map((r) => ({
    url: `${origin}/recipes/${r.slug}`,
    lastModified: r.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...newsPages, ...recipePages];
}
