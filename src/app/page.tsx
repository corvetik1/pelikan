import Hero from '@/components/home/Hero';
import Advantages from '@/components/home/Advantages';
import Categories from '@/components/home/Categories';
import NewsSection from '@/components/home/NewsSection';
import RecipesSection from '@/components/home/RecipesSection';
import StoresSection from '@/components/home/StoresSection';



// Always render dynamically during dev to avoid SSR 404 while debugging


// Incremental Static Regeneration: revalidate every hour (3600 seconds)
// Incremental Static Regeneration: каждые 60 минут
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <Advantages />
      <Categories />
      <NewsSection />
      <RecipesSection />
      <StoresSection />
    </>
  );
}
