import StoresPageClient from '@/components/stores/StoresPageClient';
import { stores } from '@/data/stores';
import type { Metadata } from 'next';

export const revalidate = 300; // ISR 5 min

export const metadata: Metadata = {
  title: 'Где купить',
};

export default function StoresPage() {
  return <StoresPageClient stores={stores} />;
}
