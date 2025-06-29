'use client';

import { Box, TextField, MenuItem, InputLabel, FormControl, Select, SelectChangeEvent } from '@mui/material';
import type { Store } from '@/data/stores';
import { useState } from 'react';

interface StoreFiltersProps {
  stores: Store[];
  onFilterChange: (region: string, query: string) => void;
}

export default function StoreFilters({ stores, onFilterChange }: StoreFiltersProps) {
  const regions = Array.from(new Set(stores.map((s) => s.region))).sort();

  const [region, setRegion] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const handleRegion = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setRegion(value);
    onFilterChange(value, query);
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onFilterChange(region, value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
      <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }} size="small">
        <InputLabel id="region-label">Регион</InputLabel>
        <Select
          labelId="region-label"
          id="region-select"
          value={region}
          label="Регион"
          onChange={handleRegion}
        >
          <MenuItem value="">Все регионы</MenuItem>
          {regions.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Поиск"
        size="small"
        value={query}
        onChange={handleQuery}
        sx={{ flexGrow: 1 }}
      />
    </Box>
  );
}
