import type { MetadataRoute } from 'next';

function baseUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? '';
  return env || 'http://localhost:3000';
}

export default function robots(): MetadataRoute.Robots {
  const origin = baseUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
    sitemap: [`${origin}/sitemap.xml`],
  };
}
