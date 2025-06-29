import Hero from '@/components/home/Hero';
import Advantages from '@/components/home/Advantages';
import Categories from '@/components/home/Categories';

// Incremental Static Regeneration: revalidate every hour (3600 seconds)
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <Advantages />
      <Categories />
    </>
  );
}
