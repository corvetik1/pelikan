'use client';

import { useMemo, useState } from 'react';
import StoreFilters from './StoreFilters';
import dynamic from 'next/dynamic';
const StoreMap = dynamic(() => import('./StoreMap'), { ssr: false });
import { Box } from '@mui/material';
import type { Store } from '@/data/stores';

interface StoresPageClientProps {
  stores: Store[];
}

export default function StoresPageClient({ stores }: StoresPageClientProps) {
  const [region, setRegion] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const filtered = useMemo(() => {
    return stores.filter((s) => {
      const matchRegion = region ? s.region === region : true;
      const matchQuery = query ? s.name.toLowerCase().includes(query.toLowerCase()) : true;
      return matchRegion && matchQuery;
    });
  }, [stores, region, query]);

  const handleFilterChange = (newRegion: string, newQuery: string) => {
    setRegion(newRegion);
    setQuery(newQuery);
  };

  return (
    <Box>
      <StoreFilters stores={stores} onFilterChange={handleFilterChange} />
      <StoreMap stores={filtered} />
    </Box>
  );
}
