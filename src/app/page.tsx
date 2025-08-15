import Hero from '@/components/home/Hero';
import Advantages from '@/components/home/Advantages';
import Categories from '@/components/home/Categories';
import NewsSection from '@/components/home/NewsSection';
import RecipesSection from '@/components/home/RecipesSection';
import CtaSection from '@/components/home/CtaSection';
import { siteOrigin } from '@/lib/site';



// Always render dynamically during dev to avoid SSR 404 while debugging


// Incremental Static Regeneration: revalidate every hour (3600 seconds)
// Incremental Static Regeneration: каждые 60 минут
export const revalidate = 3600;

export default function Home(): React.JSX.Element {
  const origin: string = siteOrigin();
  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Бухта пеликанов',
    url: origin,
    inLanguage: 'ru-RU',
  } as const;
  return (
    <>
      {/* JSON-LD: WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <Hero />
      <Advantages />
      <Categories />
      <NewsSection />
      <RecipesSection />
      <CtaSection />
    </>
  );
}
