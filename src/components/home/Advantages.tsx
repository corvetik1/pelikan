import React from 'react';
import { getAdvantages } from '@/lib/data/advantages';
import type { Advantage } from '@/types/advantages';
import AdvantagesClient from '@/components/home/AdvantagesClient';

export default async function Advantages(): Promise<React.JSX.Element> {
  const items: Advantage[] = await getAdvantages();
  return <AdvantagesClient items={items} />;
}
